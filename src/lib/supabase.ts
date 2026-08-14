"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { THERAPISTS } from "./config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

/**
 * Returns the shared Supabase browser client, or null when the project keys
 * are not configured (so the marketing site still builds/renders without them).
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

export const bookingEnabled = Boolean(url && anonKey);

/** Business booking hours as hourly start slots (last treatment starts 20:00). */
export const OPEN_HOUR = 10;
export const CLOSE_HOUR = 21; // treatments must finish by 21:00 (9pm close)

export const HOUR_SLOTS: string[] = Array.from(
  { length: CLOSE_HOUR - OPEN_HOUR },
  (_, i) => `${String(OPEN_HOUR + i).padStart(2, "0")}:00`
);

/** Number of hourly slots a treatment of the given minutes occupies. */
export function slotsForMinutes(minutes: number): number {
  return Math.max(1, Math.ceil(minutes / 60));
}

/** The hourly slots a booking starting at `start` (HH:MM) for `minutes` uses. */
export function occupiedSlots(start: string, minutes: number): string[] {
  const startHour = Number(start.slice(0, 2));
  const span = slotsForMinutes(minutes);
  return Array.from({ length: span }, (_, i) => `${String(startHour + i).padStart(2, "0")}:00`);
}

export type SlotLoadRow = { slot_time: string; busy: number; blocked: boolean };
/** How many therapists are busy per hourly slot, and owner-blocked slots. */
export type SlotLoad = Record<string, { busy: number; blocked: boolean }>;
export type BookingRow = {
  id: string;
  created_at: string;
  service_name: string;
  minutes: number;
  mode: string;
  people: number;
  booking_date: string;
  booking_time: string;
  name: string | null;
  notes: string | null;
  status: string;
};

/** Therapist load per hourly slot for a date (bookings by guest count + blocks). */
export async function getSlotLoad(date: string): Promise<SlotLoad> {
  const sb = getSupabase();
  if (!sb || !date) return {};
  const { data, error } = await sb.rpc("slot_load", { d: date });
  if (error || !data) return {};
  const load: SlotLoad = {};
  (data as SlotLoadRow[]).forEach((r) => {
    load[r.slot_time.slice(0, 5)] = { busy: r.busy, blocked: r.blocked };
  });
  return load;
}

/**
 * Start times where a treatment of `minutes` for `guests` people fits: every
 * hour it spans must close before closing time, not be blocked by the owner,
 * and still have a free therapist for each guest.
 */
export function availableStartTimes(
  load: SlotLoad,
  minutes: number,
  guests = 1,
  capacity = THERAPISTS
): string[] {
  return HOUR_SLOTS.filter((start) => {
    const endHour = Number(start.slice(0, 2)) + slotsForMinutes(minutes);
    if (endHour > CLOSE_HOUR) return false; // would run past closing
    return occupiedSlots(start, minutes).every((s) => {
      const slot = load[s];
      if (!slot) return true;
      return !slot.blocked && slot.busy + guests <= capacity;
    });
  });
}

/** Insert a customer booking request. Returns true on success. */
export async function createBooking(input: {
  serviceName: string;
  minutes: number;
  mode: string;
  people: number;
  date: string;
  time: string;
  name: string;
  notes: string;
}): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { error } = await sb.from("bookings").insert({
    service_name: input.serviceName,
    minutes: input.minutes,
    mode: input.mode,
    people: input.people,
    booking_date: input.date,
    booking_time: input.time,
    name: input.name || null,
    notes: input.notes || null,
  });
  return !error;
}

/**
 * Log a lightweight contact/enquiry event (fire-and-forget). Used for private
 * dev stats + Telegram pings — never blocks or surfaces errors to the visitor.
 */
export function logEvent(type: string, detail?: string): void {
  const sb = getSupabase();
  if (!sb) return;
  void sb
    .from("events")
    .insert({ type, detail: detail ?? null })
    .then(() => {});
}
