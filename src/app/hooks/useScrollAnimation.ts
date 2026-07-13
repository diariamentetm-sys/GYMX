import { useInView } from "motion/react";
import { useRef } from "react";

/**
 * Hook customizado para animações de scroll
 *
 * @param options - Opções de configuração do IntersectionObserver
 * @returns ref e isInView
 *
 * @example
 * const { ref, isInView } = useScrollAnimation({ margin: "-100px" });
 *
 * <motion.div
 *   ref={ref}
 *   initial={{ opacity: 0, y: 50 }}
 *   animate={isInView ? { opacity: 1, y: 0 } : {}}
 * >
 *   Content
 * </motion.div>
 */
export function useScrollAnimation(options?: {
  once?: boolean;
  margin?: string;
  amount?: number | "some" | "all";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px",
    ...options,
  });

  return { ref, isInView };
}

/**
 * Hook para scroll suave para um elemento
 *
 * @example
 * const scrollTo = useScrollTo();
 * scrollTo("#about");
 */
export function useScrollTo() {
  return (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
}

/**
 * Hook para detectar direção do scroll
 *
 * @returns "up" | "down" | null
 *
 * @example
 * const scrollDirection = useScrollDirection();
 *
 * // Use para esconder/mostrar header baseado na direção
 * <Header className={scrollDirection === "down" ? "hide" : "show"} />
 */
export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? "down" : "up";

      if (
        direction !== scrollDirection &&
        Math.abs(scrollY - lastScrollY) > 10
      ) {
        setScrollDirection(direction);
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDirection]);

  return scrollDirection;
}

// Re-export necessários
import { useEffect, useState } from "react";
