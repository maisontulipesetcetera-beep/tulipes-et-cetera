import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
config({ path: ".env.local" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash("CHANGE_ME", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@tulipes-et-cetera.fr" },
    update: {},
    create: {
      email: "admin@tulipes-et-cetera.fr",
      passwordHash,
      name: "Administrateur",
    },
  });

  console.log("Admin user created:", admin.email);

  // Create default settings
  const settings = await prisma.settings.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      propertyName: "Tulipes EtCetera",
      address: "2 Rue des Tulipes, 68640 Waldighoffen",
      phone: "+33389400290",
      email: "",
      checkInTime: "16:00",
      checkOutTime: "11:00",
      basePrice: 17900,
      depositPercent: 30,
    },
  });

  console.log("Settings created for:", settings.propertyName);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
