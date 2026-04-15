export interface ExternalBooking {
  start: Date;
  end: Date;
  summary: string;
  source: "booking" | "airbnb";
}

/**
 * Minimal iCal parser — no external dependency needed.
 * Handles DTSTART, DTEND, SUMMARY from VEVENT blocks.
 */
function parseIcalDate(value: string): Date {
  // Format: 20240101T120000Z or 20240101
  const clean = value.replace(/[TZ]/g, "");
  const year = parseInt(clean.slice(0, 4), 10);
  const month = parseInt(clean.slice(4, 6), 10) - 1;
  const day = parseInt(clean.slice(6, 8), 10);
  const hour = clean.length >= 10 ? parseInt(clean.slice(8, 10), 10) : 0;
  const min = clean.length >= 12 ? parseInt(clean.slice(10, 12), 10) : 0;
  return new Date(Date.UTC(year, month, day, hour, min));
}

function parseIcalText(text: string): Array<Record<string, string>> {
  // Unfold lines (RFC 5545 line folding: CRLF + whitespace)
  const unfolded = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
  const lines = unfolded.split(/\r?\n/);

  const events: Array<Record<string, string>> = [];
  let current: Record<string, string> | null = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (line === "BEGIN:VEVENT") {
      current = {};
    } else if (line === "END:VEVENT") {
      if (current) events.push(current);
      current = null;
    } else if (current) {
      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) continue;
      // Key may have parameters: DTSTART;VALUE=DATE:20240101
      const rawKey = line.slice(0, colonIdx);
      const value = line.slice(colonIdx + 1);
      const key = rawKey.split(";")[0].toUpperCase();
      current[key] = value;
    }
  }

  return events;
}

export async function fetchIcalEvents(
  url: string,
  source: "booking" | "airbnb",
): Promise<ExternalBooking[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`iCal fetch failed: ${response.status} ${url}`);
  }
  const text = await response.text();
  const events = parseIcalText(text);

  return events
    .map((e) => {
      const startRaw = e["DTSTART"];
      const endRaw = e["DTEND"];
      if (!startRaw || !endRaw) return null;
      return {
        start: parseIcalDate(startRaw),
        end: parseIcalDate(endRaw),
        summary: e["SUMMARY"] || "Réservé",
        source,
      };
    })
    .filter((e): e is ExternalBooking => e !== null);
}

export function generateIcal(
  reservations: {
    checkIn: Date;
    checkOut: Date;
    guestName: string;
    id: string;
  }[],
): string {
  function formatDate(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      "00Z"
    );
  }

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tulipes Et Cetera//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const r of reservations) {
    lines.push(
      "BEGIN:VEVENT",
      `DTSTART:${formatDate(r.checkIn)}`,
      `DTEND:${formatDate(r.checkOut)}`,
      `SUMMARY:Réservé - ${r.guestName}`,
      `UID:${r.id}@tulipes-et-cetera.fr`,
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
