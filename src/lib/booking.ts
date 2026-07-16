import { business, IN_HOME_SURCHARGE } from "./config";

export interface BookingState {
  serviceName: string;
  minutes: number;
  price: number;
  mode: "spa" | "home";
  people: number;
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
  const guests = b.people || 1;
  const base = b.price * guests;
  if (b.mode !== "home") return base;
  return base + IN_HOME_SURCHARGE * guests + (b.travelFee ?? 0);
}

export function buildMessage(b: BookingState): string {
  const lines: string[] = [];
  lines.push(`Hello ${business.name}! I'd like to book a treatment.`);
  lines.push("");
  lines.push(`• Treatment: ${b.serviceName}`);
  lines.push(`• Duration: ${b.minutes} min`);
  if (b.people > 1) lines.push(`• Guests: ${b.people}`);
  lines.push(`• Location: ${b.mode === "home" ? "In-home (outcall)" : "At the studio"}`);
  if (b.mode === "home") {
    const guests = b.people || 1;
    lines.push(`• In-home surcharge: +${money(IN_HOME_SURCHARGE * guests)}`);
    if (b.zoneLabel) lines.push(`• Area: ${b.zoneLabel}`);
    lines.push(`• Travel fee: ${b.travelFee ? money(b.travelFee) : "—"}`);
  }
  if (b.date) lines.push(`• Preferred date: ${b.date}`);
  if (b.time) lines.push(`• Preferred time: ${b.time}`);
  if (b.name) lines.push(`• Name: ${b.name}`);
  if (b.notes) lines.push(`• Notes: ${b.notes}`);
  lines.push("");
  lines.push(`Estimated total: ${money(bookingTotal(b))}`);
  return lines.join("\n");
}

export function emailLink(b: BookingState): string {
  const subject = `Booking request — ${b.serviceName}`;
  const body = buildMessage(b);
  return `mailto:${business.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
