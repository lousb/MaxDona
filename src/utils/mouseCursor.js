import React from "react";
import useMousePosition from "./useMousePosition";

const MouseCursor = () => {
  const { x, y } = useMousePosition("body");

  

  return (
    <div
      className="large-arrow-cursor"
      style={{
        position: "fixed",
        left: x + 40,
        top: y + 40,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
      className="arrow-cursor-image"
      
    ></div>
    </div>
  );
};

export default MouseCursor;
