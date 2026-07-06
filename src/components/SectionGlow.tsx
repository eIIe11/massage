// Decorative, non-interactive background layer for light sections:
// soft blurred colour orbs to add depth instead of a flat fill.
export default function SectionGlow({
  variant = "cream",
}: {
  variant?: "cream" | "soft";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`glow-orb h-[30rem] w-[30rem] ${
          variant === "cream" ? "bg-luxe-200/40" : "bg-gold-light/25"
        } -left-40 -top-24`}
      />
      <div className="glow-orb -right-32 top-1/2 h-[26rem] w-[26rem] bg-gold-light/20" />
      <div className="glow-orb bottom-0 left-1/3 h-[22rem] w-[22rem] bg-luxe-100/50" />
    </div>
  );
}
