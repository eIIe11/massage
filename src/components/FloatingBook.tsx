"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useBooking } from "./booking/BookingProvider";

export default function FloatingBook() {
  const { openBooking } = useBooking();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => openBooking()}
          className="btn-primary fixed bottom-5 right-5 z-40 shadow-luxe sm:bottom-7 sm:right-7"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Book Now</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
