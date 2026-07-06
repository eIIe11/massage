import Image from "next/image";
import Reveal from "./Reveal";

const shots = [
  { src: "/images/room.jpg", alt: "Treatment room", span: "sm:col-span-2 sm:row-span-2" },
  { src: "/images/aroma.jpg", alt: "Aromatherapy oils", span: "" },
  { src: "/images/hotstone.jpg", alt: "Hot stone therapy", span: "" },
  { src: "/images/reflexology.jpg", alt: "Foot reflexology", span: "" },
  { src: "/images/lymphatic.jpg", alt: "Lymphatic drainage", span: "" },
];

export default function Gallery() {
  return (
    <section className="bg-cream-soft py-24">
      <div className="container-luxe">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4 justify-center">
            <span className="h-px w-8 bg-luxe-700" /> A Glimpse
          </p>
          <h2 className="heading text-4xl sm:text-5xl">The Luxe experience</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:grid-cols-4">
            {shots.map((s) => (
              <div
                key={s.src}
                className={`group relative overflow-hidden rounded-2xl ${s.span}`}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/20" />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
