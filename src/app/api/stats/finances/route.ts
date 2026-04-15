import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Last 12 months range
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const reservations = await db.reservation.findMany({
      where: {
        status: { in: ["confirmed", "in_progress", "completed"] },
        checkIn: { gte: twelveMonthsAgo },
      },
      select: {
        id: true,
        guestName: true,
        checkIn: true,
        checkOut: true,
        source: true,
        totalAmount: true,
        depositAmount: true,
        depositPaid: true,
        status: true,
      },
      orderBy: { checkIn: "desc" },
    });

    // Monthly revenue
    const revenueMap: Record<string, number> = {};
    const occupancyMap: Record<
      string,
      { bookedDays: number; totalDays: number }
    > = {};

    // Build month keys for last 12 months
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      revenueMap[key] = 0;
      const daysInMonth = new Date(
        d.getFullYear(),
        d.getMonth() + 1,
        0,
      ).getDate();
      occupancyMap[key] = { bookedDays: 0, totalDays: daysInMonth };
    }

    const sourceMap: Record<string, number> = {
      direct: 0,
      booking: 0,
      airbnb: 0,
    };

    for (const r of reservations) {
      const key = `${r.checkIn.getFullYear()}-${String(r.checkIn.getMonth() + 1).padStart(2, "0")}`;
      const amount = r.totalAmount ?? 0;

      if (key in revenueMap) {
        revenueMap[key] += amount;
      }

      // Source breakdown
      const src = r.source ?? "direct";
      if (src in sourceMap) {
        sourceMap[src] += amount;
      } else {
        sourceMap[src] = amount;
      }

      // Occupancy: count booked days within the month
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      // For each month key in the range
      Object.keys(occupancyMap).forEach((mKey) => {
        const [yr, mo] = mKey.split("-").map(Number);
        const monthStart = new Date(yr, mo - 1, 1);
        const monthEnd = new Date(yr, mo, 0, 23, 59, 59);
        const overlapStart = checkIn < monthStart ? monthStart : checkIn;
        const overlapEnd = checkOut > monthEnd ? monthEnd : checkOut;
        if (overlapStart < overlapEnd) {
          const days = Math.ceil(
            (overlapEnd.getTime() - overlapStart.getTime()) /
              (1000 * 60 * 60 * 24),
          );
          occupancyMap[mKey].bookedDays += days;
        }
      });
    }

    const monthlyRevenue = Object.entries(revenueMap).map(
      ([month, amount]) => ({
        month,
        amount,
      }),
    );

    const sourceBreakdown = Object.entries(sourceMap).map(
      ([source, amount]) => ({
        source,
        amount,
      }),
    );

    const monthlyOccupancy = Object.entries(occupancyMap).map(
      ([month, { bookedDays, totalDays }]) => ({
        month,
        rate: totalDays > 0 ? Math.round((bookedDays / totalDays) * 100) : 0,
      }),
    );

    // Payments table
    const payments = reservations.map((r) => {
      const total = r.totalAmount ?? 0;
      const paymentStatus: "paid" | "pending" = r.depositPaid
        ? "paid"
        : "pending";

      return {
        id: r.id,
        guestName: r.guestName,
        checkIn: r.checkIn.toISOString(),
        checkOut: r.checkOut.toISOString(),
        total,
        depositPaid: r.depositPaid,
        paymentStatus,
      };
    });

    return NextResponse.json({
      monthlyRevenue,
      sourceBreakdown,
      monthlyOccupancy,
      payments,
    });
  } catch (err) {
    console.error("[GET /api/stats/finances]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
