import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    // Skip if window is undefined (e.g., during SSR)
    if (typeof window === "undefined") return;

    const handleResize = () => setWidth(window.innerWidth);

    // Set initial width immediately
    setWidth(window.innerWidth);

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

export default useWindowSize;
