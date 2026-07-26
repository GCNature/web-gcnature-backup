import { useEffect, useRef, useState } from "react";

export const useScrollReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);

    // Backup timeout: force reveal if IntersectionObserver fails to trigger within 1.2s
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [threshold]);

  return { ref, isVisible };
};

/** Counter animation hook - counts up from 0 to target */
export const useCountUp = (target: number, duration = 1500, start = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
};
