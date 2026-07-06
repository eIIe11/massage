"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";

const BookingModal = dynamic(() => import("./BookingModal"), { ssr: false });

interface BookingCtx {
  open: boolean;
  initialServiceId?: string;
  openBooking: (serviceId?: string) => void;
  closeBooking: () => void;
}

const Ctx = createContext<BookingCtx | null>(null);

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

export default function BookingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [initialServiceId, setInitialServiceId] = useState<string | undefined>();

  const openBooking = useCallback((serviceId?: string) => {
    setInitialServiceId(serviceId);
    setOpen(true);
  }, []);

  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, initialServiceId, openBooking, closeBooking }),
    [open, initialServiceId, openBooking, closeBooking]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {open && (
        <BookingModal
          initialServiceId={initialServiceId}
          onClose={closeBooking}
        />
      )}
    </Ctx.Provider>
  );
}
