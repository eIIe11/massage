"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  MessageCircle,
  Mail,
  Check,
} from "lucide-react";
import { services, fromPrice } from "@/lib/services";
import {
  BookingState,
  bookingTotal,
  buildMessage,
  emailLink,
  money,
} from "@/lib/booking";
import { whatsappLink } from "@/lib/config";
import {
  bookingEnabled,
  getTakenSlots,
  availableStartTimes,
  createBooking,
  HOUR_SLOTS,
} from "@/lib/supabase";

export default function BookingModal({
  initialServiceId,
  onClose,
}: {
  initialServiceId?: string;
  onClose: () => void;
}) {
  const initial =
    services.find((s) => s.id === initialServiceId) ?? services[0];

  const [serviceId, setServiceId] = useState(initial.id);
  const service = useMemo(
    () => services.find((s) => s.id === serviceId) ?? services[0],
    [serviceId]
  );

  const [minutes, setMinutes] = useState(initial.options[0].minutes);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Keep a valid duration when the service changes.
  useEffect(() => {
    if (!service.options.some((o) => o.minutes === minutes)) {
      setMinutes(service.options[0].minutes);
    }
  }, [service, minutes]);

  // Fetch which slots are already taken for the chosen date.
  useEffect(() => {
    if (!bookingEnabled || !date) {
      setTakenSlots([]);
      return;
    }
    let active = true;
    setLoadingSlots(true);
    getTakenSlots(date).then((slots) => {
      if (active) {
        setTakenSlots(slots);
        setLoadingSlots(false);
      }
    });
    return () => {
      active = false;
    };
  }, [date]);

  const availableTimes = useMemo(
    () => (bookingEnabled ? availableStartTimes(takenSlots, minutes) : HOUR_SLOTS),
    [takenSlots, minutes]
  );

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

  const price =
    service.options.find((o) => o.minutes === minutes)?.price ??
    service.options[0].price;

  const state: BookingState = {
    serviceName: service.name,
    minutes,
    price,
    date,
    time,
    name,
    notes,
  };

  const total = bookingTotal(state);

  const today = new Date().toISOString().split("T")[0];

  const [recorded, setRecorded] = useState(false);
  const recordBooking = () => {
    if (!bookingEnabled || recorded || !date || !time) return;
    setRecorded(true);
    createBooking({
      serviceName: service.name,
      minutes,
      mode: "spa",
      people: 1,
      date,
      time,
      name,
      notes,
    });
  };

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
            {/* Service */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                1 · Choose a treatment
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — from {money(fromPrice(s))}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-ink-soft">{service.short}</p>
            </div>

            {/* Duration */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">
                2 · Duration
              </label>
              <div className="flex flex-wrap gap-2">
                {service.options.map((o) => (
                  <button
                    key={o.minutes}
                    onClick={() => setMinutes(o.minutes)}
                    className={`rounded-full border px-5 py-2.5 text-sm transition ${
                      minutes === o.minutes
                        ? "border-luxe-700 bg-luxe-700 text-cream"
                        : "border-black/10 bg-white text-ink hover:border-luxe-700/50"
                    }`}
                  >
                    {o.minutes} min · {money(o.price)}
                  </button>
                ))}
              </div>
            </div>

            {/* Date / time */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-ink">
                  3 · Date
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
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-ink focus:border-luxe-700 focus:outline-none"
              />
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
                {service.name} · {minutes} min
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
                href={whatsappLink(buildMessage(state))}
                target="_blank"
                rel="noopener noreferrer"
                onClick={recordBooking}
                className="btn-primary flex-1"
              >
                <MessageCircle className="h-4 w-4" />
                Book via WhatsApp
              </a>
              <a
                href={emailLink(state)}
                onClick={recordBooking}
                className="btn-outline sm:w-auto"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>
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
