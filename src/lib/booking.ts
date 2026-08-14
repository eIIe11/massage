import { business, IN_HOME_SURCHARGE } from "./config";

export interface GuestChoice {
  serviceName: string;
  minutes: number;
  price: number;
}

export interface BookingState {
  guests: GuestChoice[]; // one entry per person
  mode: "spa" | "home";
  date: string;
  time: string;
  name: string;
  notes: string;
  // in-home only
  travelFee?: number;
  zoneLabel?: string;
}

export const money = (n: number) => `${business.currency}${n.toLocaleString()}`;

export function bookingTotal(b: BookingState): number {
  const base = b.guests.reduce((sum, g) => sum + g.price, 0);
  if (b.mode !== "home") return base;
  return base + IN_HOME_SURCHARGE * b.guests.length + (b.travelFee ?? 0);
}

export function buildMessage(b: BookingState): string {
  const lines: string[] = [];
  lines.push(`Hello ${business.name}! I'd like to book a treatment.`);
  lines.push("");

  if (b.guests.length === 1) {
    lines.push(`• Treatment: ${b.guests[0].serviceName}`);
    lines.push(`• Duration: ${b.guests[0].minutes} min`);
  } else {
    lines.push(`• Guests: ${b.guests.length}`);
    b.guests.forEach((g, i) => {
      lines.push(`• Person ${i + 1}: ${g.serviceName} (${g.minutes} min)`);
    });
  }

  lines.push(
    `• Location: ${b.mode === "home" ? "In-villa (outcall)" : "At the studio"}`
  );
  if (b.mode === "home") {
    lines.push(
      `• In-villa surcharge: +${money(IN_HOME_SURCHARGE * b.guests.length)}`
    );
    if (b.zoneLabel) lines.push(`• Area: ${b.zoneLabel}`);
    lines.push(`• Travel fee: ${b.travelFee ? money(b.travelFee) : "—"}`);
  }
  lines.push(`• Preferred date: ${b.date}`);
  lines.push(`• Preferred time: ${b.time}`);
  lines.push(`• Name: ${b.name}`);
  if (b.notes) lines.push(`• Notes: ${b.notes}`);
  lines.push("");
  lines.push(`Estimated total: ${money(bookingTotal(b))}`);
  return lines.join("\n");
}

export function emailLink(b: BookingState): string {
  const subject = `Booking request — ${b.guests
    .map((g) => g.serviceName)
    .join(", ")}`;
  const body = buildMessage(b);
  return `mailto:${business.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
