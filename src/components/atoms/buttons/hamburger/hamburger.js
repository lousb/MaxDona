import React from "react";
import './hamburger.css';

function Hamburger({ isActive }) {
  return (
    <svg
      width="33"
      height="26"
      viewBox="0 0 33 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`hamburger-button ${isActive ? 'active' : ''}`}
    >
      <path
        className="line-1"
        d="M2 2H31"
        stroke={"black"}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        className="line-2"
        d="M2 13H31"
        stroke={"black"}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        className="line-3"
        d="M2 24H31"
        stroke={"black"}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Hamburger;

