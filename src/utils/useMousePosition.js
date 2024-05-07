import { useState, useEffect } from "react";

const useMousePosition = (target) => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  const updateMousePosition = e => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    document.querySelector(target).addEventListener("mousemove", updateMousePosition);

    return () => document.querySelector(target).removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
};

export default useMousePosition;