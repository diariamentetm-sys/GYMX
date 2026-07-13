import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/**
 * Hook para obter tamanho da janela e breakpoints
 *
 * @returns WindowSize object com width, height e breakpoints
 *
 * @example
 * const { width, isMobile, isDesktop } = useWindowSize();
 *
 * return (
 *   <div>
 *     {isMobile ? <MobileNav /> : <DesktopNav />}
 *   </div>
 * );
 */
export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 768 : false,
    isTablet:
      typeof window !== "undefined"
        ? window.innerWidth >= 768 && window.innerWidth < 1024
        : false,
    isDesktop:
      typeof window !== "undefined" ? window.innerWidth >= 1024 : false,
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

/**
 * Hook para detectar se está em mobile
 *
 * @example
 * const isMobile = useIsMobile();
 */
export function useIsMobile() {
  const { isMobile } = useWindowSize();
  return isMobile;
}

/**
 * Hook para detectar orientação do dispositivo
 *
 * @returns "portrait" | "landscape"
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    typeof window !== "undefined"
      ? window.innerHeight > window.innerWidth
        ? "portrait"
        : "landscape"
      : "portrait"
  );

  useEffect(() => {
    function handleResize() {
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return orientation;
}
