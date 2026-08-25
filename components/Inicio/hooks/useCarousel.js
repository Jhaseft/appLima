import { useEffect, useRef, useState } from "react";

// Carrusel horizontal con auto-avance. Se sincroniza con el swipe manual.
export function useCarousel(length, width, interval = 3500) {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!length || !width) return;
    const id = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % length;
        ref.current?.scrollToOffset({ offset: next * width, animated: true });
        return next;
      });
    }, interval);
    return () => clearInterval(id);
  }, [length, width, interval]);

  const onMomentumScrollEnd = (e) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return { ref, index, onMomentumScrollEnd };
}
