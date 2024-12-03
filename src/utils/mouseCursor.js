import React from "react";
import { useState, useEffect } from "react";
import useMousePosition from "./useMousePosition";

const MouseCursor = () => {
  const { x, y, isOutside } = useMousePosition(".App");

  return (
    <div
      className="large-arrow-cursor"
      style={{
        position: "fixed",
        left: x + 40,
        top: y + 40,
        transform: `translate(-40px, -50%) scale(${isOutside ? 0 : 1})`,
        maxHeight:`${isOutside ? 0 : '84px'}`,
        maxWidth:`${isOutside ? 0 : '84px'}`,
      }}
    >
      <div className="arrow-cursor-image"></div>
      <div className="arrow-cursor-text body"><span>Loading</span><span>Loading</span></div>
    </div>
  );
};




export default MouseCursor;
