import Image from "next/image";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { business, whatsappLink } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-ink py-14 text-cream/70">
      <div className="container-luxe">
        <div className="flex flex-col items-center gap-8 text-center">
          <Image
            src="/luxe-logo-light.png"
            alt="Luxe Health Massage"
            width={150}
            height={142}
            className="h-20 w-auto"
          />
          <p className="max-w-md text-sm">
            {business.tagline} — Koh Samui&apos;s sanctuary for medical &amp;
            wellness massage, led by {business.owner}.
          </p>

          <div className="flex items-center gap-3">
            <a
              href={business.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-luxe-700"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={business.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-luxe-700"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={whatsappLink("Hello Luxe Health Massage!")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-luxe-700"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>

          <div className="h-px w-full max-w-xs bg-white/10" />

          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} {business.name}. All rights reserved. ·{" "}
            {business.addressLines[1]}, {business.addressLines[2]}
          </p>
        </div>
      </div>
    </footer>
  );
}
