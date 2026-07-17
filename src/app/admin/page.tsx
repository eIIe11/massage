"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Lock,
  Loader2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Check,
  X,
  Trash2,
} from "lucide-react";
import {
  getSupabase,
  bookingEnabled,
  HOUR_SLOTS,
  occupiedSlots,
  type BookingRow,
} from "@/lib/supabase";

type SlotState = "free" | "blocked" | "booked";

const todayStr = () => new Date().toISOString().split("T")[0];
const prettyDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export default function AdminPage() {
  const sb = getSupabase();

  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  // login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");

  // dashboard data
  const [date, setDate] = useState(todayStr());
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [blocks, setBlocks] = useState<Record<string, string>>({}); // time -> block id
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sb) {
      setReady(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setSignedIn(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  const load = useCallback(async () => {
    if (!sb || !signedIn) return;
    setLoading(true);
    const [{ data: bk }, { data: bl }] = await Promise.all([
      sb
        .from("bookings")
        .select("*")
        .eq("booking_date", date)
        .order("booking_time"),
      sb.from("blocks").select("id, block_time").eq("block_date", date),
    ]);
    setBookings((bk as BookingRow[]) ?? []);
    const map: Record<string, string> = {};
    (bl as { id: string; block_time: string }[] | null)?.forEach((r) => {
      map[r.block_time.slice(0, 5)] = r.id;
    });
    setBlocks(map);
    setLoading(false);
  }, [sb, signedIn, date]);

  useEffect(() => {
    load();
  }, [load]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb) return;
    setAuthBusy(true);
    setAuthError("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setAuthBusy(false);
  };

  const signOut = async () => {
    await sb?.auth.signOut();
  };

  // Which hourly slots are consumed by active bookings.
  const bookedSlots = new Set<string>();
  bookings
    .filter((b) => b.status !== "cancelled")
    .forEach((b) =>
      occupiedSlots(b.booking_time.slice(0, 5), b.minutes).forEach((s) =>
        bookedSlots.add(s)
      )
    );

  const stateFor = (time: string): SlotState => {
    if (bookedSlots.has(time)) return "booked";
    if (blocks[time]) return "blocked";
    return "free";
  };

  const toggleSlot = async (time: string) => {
    if (!sb) return;
    const st = stateFor(time);
    if (st === "booked") return; // can't block a booked slot
    if (st === "blocked") {
      const id = blocks[time];
      setBlocks((m) => {
        const n = { ...m };
        delete n[time];
        return n;
      });
      await sb.from("blocks").delete().eq("id", id);
    } else {
      setBlocks((m) => ({ ...m, [time]: "pending" }));
      const { data } = await sb
        .from("blocks")
        .insert({ block_date: date, block_time: time })
        .select("id")
        .single();
      if (data) setBlocks((m) => ({ ...m, [time]: (data as { id: string }).id }));
    }
  };

  const setStatus = async (id: string, status: string) => {
    if (!sb) return;
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    await sb.from("bookings").update({ status }).eq("id", id);
  };

  const shiftDay = (delta: number) => {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split("T")[0]);
  };

  // ---- render ----
  if (!bookingEnabled) {
    return (
      <Shell>
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-black/5">
          <h1 className="heading text-2xl text-luxe-800">Booking backend not configured</h1>
          <p className="mt-3 text-sm text-ink-soft">
            The Supabase environment keys are missing from this build.
          </p>
        </div>
      </Shell>
    );
  }

  if (!ready) {
    return (
      <Shell>
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-luxe-700" />
      </Shell>
    );
  }

  if (!signedIn) {
    return (
      <Shell>
        <form
          onSubmit={signIn}
          className="mx-auto w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5"
        >
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-luxe-700/10">
              <Lock className="h-5 w-5 text-luxe-700" />
            </span>
            <h1 className="heading mt-3 text-2xl text-luxe-800">Owner login</h1>
            <p className="mt-1 text-sm text-ink-soft">Luxe Health Massage · calendar</p>
          </div>
          <label className="mb-1 block text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none"
          />
          <label className="mb-1 block text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none"
          />
          {authError && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{authError}</p>
          )}
          <button type="submit" disabled={authBusy} className="btn-primary w-full">
            {authBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </button>
        </form>
      </Shell>
    );
  }

  const activeBookings = bookings.filter((b) => b.status !== "cancelled");

  return (
    <Shell>
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="eyebrow">Owner dashboard</p>
            <h1 className="heading text-3xl text-luxe-800">Calendar</h1>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-ink hover:bg-black/5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        {/* Date navigation */}
        <div className="mb-5 flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
          <button onClick={() => shiftDay(-1)} className="rounded-full p-2 hover:bg-black/5">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-luxe-700" />
            <span className="font-medium text-ink">{prettyDate(date)}</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-lg border border-black/10 px-2 py-1 text-sm"
            />
          </div>
          <button onClick={() => shiftDay(1)} className="rounded-full p-2 hover:bg-black/5">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {loading && (
          <div className="mb-4 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-luxe-700" />
          </div>
        )}

        {/* Slot grid */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <p className="mb-3 text-sm text-ink-soft">
            Tap a free slot to mark it <b>unavailable</b>. Tap again to reopen it. Booked slots are locked.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {HOUR_SLOTS.map((t) => {
              const st = stateFor(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleSlot(t)}
                  disabled={st === "booked"}
                  className={
                    "rounded-xl px-3 py-3 text-sm font-medium transition " +
                    (st === "booked"
                      ? "cursor-not-allowed bg-luxe-700 text-cream"
                      : st === "blocked"
                      ? "bg-ink/70 text-cream"
                      : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100")
                  }
                >
                  {t}
                  <span className="mt-0.5 block text-[10px] font-normal opacity-80">
                    {st === "booked" ? "Booked" : st === "blocked" ? "Unavailable" : "Open"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookings list */}
        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-3 font-serif text-xl text-luxe-800">
            Bookings ({activeBookings.length})
          </h2>
          {bookings.length === 0 ? (
            <p className="text-sm text-ink-soft">No bookings for this day.</p>
          ) : (
            <ul className="divide-y divide-black/5">
              {bookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                  <div className={b.status === "cancelled" ? "opacity-40 line-through" : ""}>
                    <p className="font-medium text-ink">
                      {b.booking_time.slice(0, 5)} · {b.service_name} · {b.minutes}m
                    </p>
                    <p className="text-sm text-ink-soft">
                      {b.name || "—"}
                      {b.mode === "home" ? " · In-villa" : " · Studio"}
                      {b.people > 1 ? ` · ${b.people} guests` : ""}
                      {b.notes ? ` · ${b.notes}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {b.status !== "confirmed" && b.status !== "cancelled" && (
                      <button
                        onClick={() => setStatus(b.id, "confirmed")}
                        title="Confirm"
                        className="rounded-full bg-emerald-100 p-2 text-emerald-700 hover:bg-emerald-200"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {b.status === "confirmed" && (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">
                        Confirmed
                      </span>
                    )}
                    {b.status !== "cancelled" ? (
                      <button
                        onClick={() => setStatus(b.id, "cancelled")}
                        title="Cancel"
                        className="rounded-full bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setStatus(b.id, "pending")}
                        title="Restore"
                        className="rounded-full bg-black/5 p-2 text-ink-soft hover:bg-black/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-soft px-4 py-10">
      <div className="w-full">{children}</div>
    </main>
  );
}
