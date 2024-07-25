import { useState, useEffect } from "react";

const useMousePosition = (element = ".App") => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOutside, setIsOutside] = useState(false);

  useEffect(() => {
    const updatePosition = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setIsOutside(false);
    };

    const handleMouseLeave = (event) => {
      if (event.clientY <= 0 || event.clientX <= 0 || event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) {
        setIsOutside(true);
      }
    };

    const handleMouseEnter = () => {
      setIsOutside(false);
    };

    const target = document.querySelector(element);
    if (target) {
      target.addEventListener("mousemove", updatePosition);
      window.addEventListener("mouseout", handleMouseLeave);
      window.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      if (target) {
        target.removeEventListener("mousemove", updatePosition);
        window.removeEventListener("mouseout", handleMouseLeave);
        window.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, [element]);

  return { ...position, isOutside };
};


export default useMousePosition;