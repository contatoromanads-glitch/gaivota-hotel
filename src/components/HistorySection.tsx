import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState, useCallback } from "react";
import { ScrollReveal } from "@/hooks/useScrollReveal";
import { Mountain, Pickaxe, MapPinned, Tractor, Factory, Gem, Droplets, TreePine } from "lucide-react";

/* ── Animated Counter ── */
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ── Flip Card ── */
function FlipCard({ icon: Icon, front, back }: { icon: React.ElementType; front: string; back: string }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card-container cursor-pointer"
      onClick={() => setFlipped(!flipped)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div className={`flip-card-inner ${flipped ? "flip-card-flipped" : ""}`}>
        {/* Front */}
        <div className="flip-card-face flip-card-front bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg">
          <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center">
            <Icon className="w-7 h-7 text-accent" />
          </div>
          <p className="font-display text-base font-semibold text-center leading-snug">{front}</p>
          <span className="text-xs text-muted-foreground mt-1">↻ toque para ver</span>
        </div>
        {/* Back */}
        <div className="flip-card-face flip-card-back bg-foreground text-background rounded-xl p-6 flex items-center justify-center shadow-lg">
          <p className="text-sm leading-relaxed text-center">{back}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Timeline Item ── */
function TimelineItem({ year, title, desc, index }: { year: string; title: string; desc: string; index: number }) {
  return (
    <ScrollReveal delay={index * 0.15} direction="up">
      <div className="relative pl-8 md:pl-0 md:text-center group">
        {/* Mobile vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-accent/30 md:hidden" />
        <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-accent border-2 border-background md:hidden timeline-dot" />

        {/* Desktop dot */}
        <div className="hidden md:block w-4 h-4 rounded-full bg-accent border-2 border-background mx-auto mb-3 timeline-dot" />

        <span className="inline-block text-accent font-bold text-lg font-display">{year}</span>
        <h4 className="font-display font-semibold text-base mt-1 mb-2">{title}</h4>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
      </div>
    </ScrollReveal>
  );
}

/* ── Main Section ── */
export default function HistorySection() {
  const { t } = useTranslation();

  const timeline = [
    { year: t("home.history.t1Year"), title: t("home.history.t1Title"), desc: t("home.history.t1Desc") },
    { year: t("home.history.t2Year"), title: t("home.history.t2Title"), desc: t("home.history.t2Desc") },
    { year: t("home.history.t3Year"), title: t("home.history.t3Title"), desc: t("home.history.t3Desc") },
    { year: t("home.history.t4Year"), title: t("home.history.t4Title"), desc: t("home.history.t4Desc") },
    { year: t("home.history.t5Year"), title: t("home.history.t5Title"), desc: t("home.history.t5Desc") },
  ];

  const curiosities = [
    { icon: Gem, front: t("home.history.c1Front"), back: t("home.history.c1Back") },
    { icon: Mountain, front: t("home.history.c2Front"), back: t("home.history.c2Back") },
    { icon: Droplets, front: t("home.history.c3Front"), back: t("home.history.c3Back") },
    { icon: TreePine, front: t("home.history.c4Front"), back: t("home.history.c4Back") },
  ];

  const stats = [
    { value: 18, suffix: " bi t", label: t("home.history.stat1") },
    { value: 100, suffix: "+t", label: t("home.history.stat2") },
    { value: 400, suffix: "+", label: t("home.history.stat3") },
    { value: 395, suffix: "k ha", label: t("home.history.stat4") },
  ];

  return (
    <section className="relative py-20 md:py-28 overflow-hidden history-earth-bg">
      {/* Animated earth gradient overlay */}
      <div className="absolute inset-0 earth-gradient-animated pointer-events-none" />

      <div className="container relative z-10">
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">{t("home.history.tag")}</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold mt-2 mb-4">{t("home.history.title")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t("home.history.subtitle")}</p>
          </div>
        </ScrollReveal>

        {/* Timeline */}
        <div className="mb-20">
          <div className="hidden md:block relative">
            <div className="absolute top-7 left-0 right-0 h-0.5 bg-accent/20" />
            <div className="grid grid-cols-5 gap-6">
              {timeline.map((item, i) => (
                <TimelineItem key={i} {...item} index={i} />
              ))}
            </div>
          </div>
          <div className="md:hidden space-y-8">
            {timeline.map((item, i) => (
              <TimelineItem key={i} {...item} index={i} />
            ))}
          </div>
        </div>

        {/* Curiosities - Flip Cards */}
        <ScrollReveal direction="up">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">{t("home.history.curiositiesTitle")}</h3>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {curiosities.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction="up">
              <FlipCard {...item} />
            </ScrollReveal>
          ))}
        </div>

        {/* Animated Counters */}
        <ScrollReveal direction="scale">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-8 md:p-12 shadow-xl">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">{t("home.history.numbersTitle")}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="font-display text-3xl md:text-4xl font-bold text-primary">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-muted-foreground text-sm mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
