import { useEffect, useRef, useState } from "react";

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const { ref, isVisible } = useScrollReveal();

  const baseStyles: React.CSSProperties = {
    transitionProperty: "opacity, transform",
    transitionDuration: "0.7s",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}s`,
  };

  const hiddenStyles: Record<string, React.CSSProperties> = {
    up: { opacity: 0, transform: "translateY(40px)" },
    left: { opacity: 0, transform: "translateX(-40px)" },
    right: { opacity: 0, transform: "translateX(40px)" },
    scale: { opacity: 0, transform: "scale(0.9)" },
  };

  const visibleStyle: React.CSSProperties = { opacity: 1, transform: "translateY(0) translateX(0) scale(1)" };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...baseStyles,
        ...(isVisible ? visibleStyle : hiddenStyles[direction]),
      }}
    >
      {children}
    </div>
  );
}
