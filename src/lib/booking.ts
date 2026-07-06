import { business, zoneForDistance } from "./config";

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
  distanceKm?: number;
  travelFee?: number;
  zoneLabel?: string;
  coords?: { lat: number; lng: number };
}

export const money = (n: number) => `${business.currency}${n.toLocaleString()}`;

export function bookingTotal(b: BookingState): number {
  const base = b.price * (b.people || 1);
  return base + (b.mode === "home" ? b.travelFee ?? 0 : 0);
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
    if (b.zoneLabel) lines.push(`• Area: ${b.zoneLabel}`);
    if (typeof b.distanceKm === "number")
      lines.push(`• Approx. distance: ${b.distanceKm.toFixed(1)} km`);
    lines.push(
      `• Travel fee: ${b.travelFee ? money(b.travelFee) : "Free"}`
    );
    if (b.coords)
      lines.push(
        `• My location: https://maps.google.com/?q=${b.coords.lat.toFixed(
          6
        )},${b.coords.lng.toFixed(6)}`
      );
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

export function zoneInfo(distanceKm: number) {
  const zone = zoneForDistance(distanceKm);
  return { fee: zone.fee, label: zone.label };
}
