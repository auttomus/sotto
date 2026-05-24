import { useState, useEffect, useRef } from "react";

interface UseScrollDirectionProps {
  threshold?: number;
  dispatchEventName?: string;
}

export function useScrollDirection({ 
  threshold = 64, 
  dispatchEventName = "scroll-header" 
}: UseScrollDirectionProps = {}) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Don't trigger on negative scroll / elastic scroll
      if (currentScrollY < 0) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > threshold) {
        // Scrolling down -> hide headers
        setShowHeader(false);
        if (dispatchEventName) {
          window.dispatchEvent(
            new CustomEvent(dispatchEventName, { detail: { isHidden: true } })
          );
        }
      } else {
        // Scrolling up -> show headers
        setShowHeader(true);
        if (dispatchEventName) {
          window.dispatchEvent(
            new CustomEvent(dispatchEventName, { detail: { isHidden: false } })
          );
        }
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, dispatchEventName]);

  return { showHeader };
}
