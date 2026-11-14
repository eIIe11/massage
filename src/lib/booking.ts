import { business } from "./config";

export interface BookingState {
  serviceName: string;
  minutes: number;
  price: number;
  date: string;
  time: string;
  name: string;
  notes: string;
}

export const money = (n: number) => `${business.currency}${n.toLocaleString()}`;

export function bookingTotal(b: BookingState): number {
  return b.price;
}

export function buildMessage(b: BookingState): string {
  const lines: string[] = [];
  lines.push(`Hello ${business.name}! I'd like to book a treatment.`);
  lines.push("");
  lines.push(`• Treatment: ${b.serviceName}`);
  lines.push(`• Duration: ${b.minutes} min`);
  lines.push("• Location: At the studio");
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
