"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Car,
  Home,
  Building2,
  MessageCircle,
  Mail,
  Check,
  Lock,
  Users,
} from "lucide-react";
import { services, fromPrice } from "@/lib/services";
import {
  travelZones,
  travelZoneById,
  IN_HOME_SURCHARGE,
  IN_HOME_LAST_START,
  whatsappLink,
} from "@/lib/config";
import {
  BookingState,
  GuestChoice,
  bookingTotal,
  buildMessage,
  emailLink,
  money,
} from "@/lib/booking";
import {
  bookingEnabled,
  getSlotLoad,
  availableStartTimes,
  createBooking,
  HOUR_SLOTS,
  type SlotLoad,
} from "@/lib/supabase";

type GuestPick = { serviceId: string; minutes: number };

const MAX_PEOPLE = 4;

export default function BookingModal({
  initialServiceId,
  onClose,
}: {
  initialServiceId?: string;
  onClose: () => void;
}) {
  const initial =
    services.find((s) => s.id === initialServiceId) ?? services[0];

  const [people, setPeople] = useState(1);
  const [guests, setGuests] = useState<GuestPick[]>([
    { serviceId: initial.id, minutes: initial.options[0].minutes },
  ]);
  const [mode, setMode] = useState<"spa" | "home">("spa");
  const [zoneId, setZoneId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [slotLoad, setSlotLoad] = useState<SlotLoad>({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Grow / shrink the per-person picks when the guest count changes.
  useEffect(() => {
    setGuests((prev) => {
      if (people === prev.length) return prev;
      const next = prev.slice(0, people);
      while (next.length < people) {
        const d = services[0];
        next.push({ serviceId: d.id, minutes: d.options[0].minutes });
      }
      return next;
    });
  }, [people]);

  const setGuestService = (i: number, serviceId: string) =>
    setGuests((prev) =>
      prev.map((g, idx) => {
        if (idx !== i) return g;
        const s = services.find((x) => x.id === serviceId) ?? services[0];
        return { serviceId, minutes: s.options[0].minutes };
      })
    );

  const setGuestMinutes = (i: number, minutes: number) =>
    setGuests((prev) =>
      prev.map((g, idx) => (idx === i ? { ...g, minutes } : g))
    );

  // Resolve each pick to its service + priced option.
  const resolved = useMemo(
    () =>
      guests.map((g) => {
        const s = services.find((x) => x.id === g.serviceId) ?? services[0];
        const opt =
          s.options.find((o) => o.minutes === g.minutes) ?? s.options[0];
        return { service: s, minutes: opt.minutes, price: opt.price };
      }),
    [guests]
  );

  const anyStudioOnly = resolved.some((r) => r.service.studioOnly);

  // Studio-only treatments (need a proper massage bed) can't be done in-villa.
  useEffect(() => {
    if (anyStudioOnly && mode === "home") setMode("spa");
  }, [anyStudioOnly, mode]);

  // Slot occupancy is driven by the longest treatment (they run in parallel).
  const maxMinutes = Math.max(...resolved.map((r) => r.minutes));

  // Fetch how many therapists are already busy per slot for the chosen date.
  useEffect(() => {
    if (!bookingEnabled || !date) {
      setSlotLoad({});
      return;
    }
    let active = true;
    setLoadingSlots(true);
    getSlotLoad(date).then((load) => {
      if (active) {
        setSlotLoad(load);
        setLoadingSlots(false);
      }
    });
    return () => {
      active = false;
    };
  }, [date]);

  const availableTimes = useMemo(() => {
    const base = bookingEnabled
      ? availableStartTimes(slotLoad, maxMinutes, people)
      : HOUR_SLOTS.filter((s) => {
          const endHour = Number(s.slice(0, 2)) + Math.ceil(maxMinutes / 60);
          return endHour <= 21;
        });
    // In-villa can't start after the cutoff (staff travel + finish time).
    return mode === "home"
      ? base.filter((t) => t <= IN_HOME_LAST_START)
      : base;
  }, [slotLoad, maxMinutes, people, mode]);

  // Drop a chosen time if it becomes unavailable (duration/date change).
  useEffect(() => {
    if (time && !availableTimes.includes(time)) setTime("");
  }, [availableTimes, time]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const guestChoices: GuestChoice[] = resolved.map((r) => ({
    serviceName: r.service.name,
    minutes: r.minutes,
    price: r.price,
  }));

  const zone = mode === "home" ? travelZoneById(zoneId) : undefined;

  const state: BookingState = {
    guests: guestChoices,
    mode,
    date,
    time,
    name,
    notes,
    travelFee: zone?.fee,
    zoneLabel: zone?.label,
  };

  const total = bookingTotal(state);

  // Everything that must be filled in before a booking can be sent.
  const missing: string[] = [];
  if (!name.trim()) missing.push("your name");
  if (!date) missing.push("a date");
  if (!time) missing.push("a time");
  if (mode === "home" && !zone) missing.push("your area");
  const canBook = missing.length === 0;

  const today = new Date().toISOString().split("T")[0];

  const [recorded, setRecorded] = useState(false);
  const recordBooking = () => {
    if (!bookingEnabled || recorded || !canBook) return;
    setRecorded(true);
    createBooking({
      serviceName: guestChoices.map((g) => g.serviceName).join(" + "),
      minutes: maxMinutes,
      mode,
      people: guestChoices.length,
      date,
      time,
      name,
      notes,
    });
  };

  const durationButtons = (i: number) => {
    const r = resolved[i];
    return (
      <div className="flex flex-wrap gap-2">
        {r.service.options.map((o) => (
          <button
            key={o.minutes}
            onClick={() => setGuestMinutes(i, o.minutes)}
            className={`rounded-full border px-5 py-2.5 text-sm transition ${
              r.minutes === o.minutes
                ? "border-luxe-700 bg-luxe-700 text-cream"
                : "border-black/10 bg-white text-ink hover:border-luxe-700/50"
            }`}
          >
            {o.minutes} min ·{" "}
            {money(mode === "home" ? o.price + IN_HOME_SURCHARGE : o.price)}
          </button>
        ))}
      </div>
    );
  };

  const serviceSelect = (i: number) => (
    <select
      value={guests[i].serviceId}
      onChange={(e) => setGuestService(i, e.target.value)}
      className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none"
    >
      {services.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name} — from{" "}
          {money(
            mode === "home" && !s.studioOnly
              ? fromPrice(s) + IN_HOME_SURCHARGE
              : fromPrice(s)
          )}
        </option>
      ))}
    </select>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
          className="relative z-10 flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 bg-white/60 px-6 py-4">
            <div>
              <p className="eyebrow">Book your treatment</p>
              <h3 className="heading text-2xl">Reserve at Luxe</h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-ink-soft transition hover:bg-black/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 space-y-7 overflow-y-auto px-6 py-6">
            {/* People */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                1 · How many people?
              </label>
              <div className="flex gap-2">
                {Array.from({ length: MAX_PEOPLE }, (_, idx) => idx + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setPeople(n)}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm font-medium transition ${
                        people === n
                          ? "border-luxe-700 bg-luxe-700 text-cream"
                          : "border-black/10 bg-white text-ink hover:border-luxe-700/50"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
              </div>
              {people > 1 && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
                  <Users className="h-3.5 w-3.5" />
                  Choose a treatment for each person below.
                </p>
              )}
            </div>

            {/* Treatment(s) */}
            {people === 1 ? (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink">
                    2 · Choose a treatment
                  </label>
                  {serviceSelect(0)}
                  <p className="mt-2 text-sm text-ink-soft">
                    {resolved[0].service.short}
                  </p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink">
                    3 · Duration
                  </label>
                  {durationButtons(0)}
                </div>
              </>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  2 · Treatments
                </label>
                <div className="space-y-4">
                  {guests.map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-black/10 bg-white/60 p-4"
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-luxe-700">
                        Person {i + 1}
                      </p>
                      {serviceSelect(i)}
                      <div className="mt-3">{durationButtons(i)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location mode */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                {people === 1 ? "4" : "3"} · Where?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode("spa")}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    mode === "spa"
                      ? "border-luxe-700 bg-luxe-50"
                      : "border-black/10 bg-white hover:border-luxe-700/40"
                  }`}
                >
                  <Building2 className="h-5 w-5 text-luxe-700" />
                  <div>
                    <p className="text-sm font-medium text-ink">At the studio</p>
                    <p className="text-xs text-ink-soft">Bang Por, Koh Samui</p>
                  </div>
                </button>
                <button
                  onClick={() => !anyStudioOnly && setMode("home")}
                  disabled={anyStudioOnly}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    anyStudioOnly
                      ? "cursor-not-allowed border-black/10 bg-black/5 opacity-60"
                      : mode === "home"
                      ? "border-luxe-700 bg-luxe-50"
                      : "border-black/10 bg-white hover:border-luxe-700/40"
                  }`}
                >
                  {anyStudioOnly ? (
                    <Lock className="h-5 w-5 text-ink-soft" />
                  ) : (
                    <Home className="h-5 w-5 text-luxe-700" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-ink">In-villa</p>
                    <p className="text-xs text-ink-soft">
                      {anyStudioOnly ? "Studio only" : "We come to you"}
                    </p>
                  </div>
                </button>
              </div>
              {anyStudioOnly && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
                  <Lock className="h-3.5 w-3.5" />
                  A selected treatment is studio only — it needs a proper massage
                  bed.
                </p>
              )}
            </div>

            {/* In-villa zone + travel fee */}
            <AnimatePresence>
              {mode === "home" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="mb-2 block text-sm font-medium text-ink">
                    Your area
                  </label>
                  <select
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none"
                  >
                    <option value="">Select your area…</option>
                    {travelZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.label} — +{money(z.fee)} travel
                      </option>
                    ))}
                  </select>
                  {zone && (
                    <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-black/5">
                      <div className="flex items-center gap-2 text-sm text-ink">
                        <Car className="h-4 w-4 text-luxe-700" />
                        <span>{zone.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-luxe-800">
                        + {money(zone.fee)}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Date / time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  {people === 1 ? "5" : "4"} · Date
                </label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!date || loadingSlots}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none disabled:opacity-60"
                >
                  <option value="">
                    {!date
                      ? "Pick a date first"
                      : loadingSlots
                      ? "Checking availability…"
                      : availableTimes.length === 0
                      ? "Fully booked — try another day"
                      : "Select a time"}
                  </option>
                  {availableTimes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {bookingEnabled && date && !loadingSlots && (
                  <p className="mt-1.5 text-xs text-ink-soft">
                    Only available times are shown.
                  </p>
                )}
              </div>
            </div>

            {/* Name / notes */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  {people === 1 ? "6" : "5"} · Your name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none"
                />
              </div>
              <textarea
                placeholder="Anything we should know? (injuries, preferences, pressure…)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer / summary */}
          <div className="border-t border-black/5 bg-white/70 px-6 py-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm text-ink-soft">
                {people === 1 ? guestChoices[0].serviceName : `${people} people`}{" "}
                · {maxMinutes} min
                {mode === "home" && <span> · in-villa</span>}
                {mode === "home" && zone && (
                  <span> · +{money(zone.fee)} travel</span>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-soft">Estimated total</p>
                <p className="font-serif text-2xl text-luxe-800">
                  {money(total)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <a
                href={canBook ? whatsappLink(buildMessage(state)) : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!canBook}
                onClick={recordBooking}
                className={`btn-primary flex-1 ${
                  !canBook ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                Book via WhatsApp
              </a>
              <a
                href={canBook ? emailLink(state) : undefined}
                aria-disabled={!canBook}
                onClick={recordBooking}
                className={`btn-outline sm:w-auto ${
                  !canBook ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
            {!canBook && (
              <p className="mt-2 text-center text-xs text-luxe-700">
                Please add {missing.join(", ")} to continue.
              </p>
            )}
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-ink-soft">
              <Check className="h-3.5 w-3.5 text-luxe-700" />
              No prepayment — we confirm your booking on WhatsApp.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
