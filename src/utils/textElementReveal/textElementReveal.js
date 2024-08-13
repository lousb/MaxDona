import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { motion } from "framer-motion";
import { reveal, paddingReveal, opacity } from "./anim";
import { useLoading } from "../LoadingContext";

function Reveal({ textContent, element, elementClass = "", custom, variant }) {
  const [isVisible, setIsVisible] = useState(false);
  const [delayPassed, setDelayPassed] = useState(false); // New state for delay
  const [isScreenWide, setIsScreenWide] = useState(window.innerWidth >= 830); // State for screen size
  const ref = useRef(null);
  const { isLoading } = useLoading();

  useEffect(() => {
    const handleResize = () => {
      setIsScreenWide(window.innerWidth >= 830);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let delayTimeout;
    if (isLoading) {
      setDelayPassed(false);
      delayTimeout = setTimeout(() => {
        setDelayPassed(true); // Delay of 600ms before setting delayPassed to true
      }, 600);
    } else {
      setDelayPassed(true);
    }

    const handleScroll = () => {
      if (ref.current && delayPassed && isScreenWide) {
        const elementTop = ref.current.getBoundingClientRect().top;
        setIsVisible(elementTop < window.innerHeight);
      }
    };

    // Check on initial load
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(delayTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, delayPassed, isScreenWide]);

  if (!isScreenWide) {
    return <div className={`text-reveal-container ${elementClass}`}>{textContent}</div>;
  }

  const MotionComponent = motion[element] || motion.div;

  const classes = elementClass.split(" ").join(" ");

  const lines = textContent.split("\n").map((line, index) => {
    if (elementClass.includes("title") || elementClass.includes("heading")) {
      return (
        <MotionComponent
          key={index}
          className={`text-reveal-element ${classes}`}
          variants={reveal}
          initial="initial"
          animate={isVisible ? "open" : "closed"}
          custom={custom}
        >
          {line}
        </MotionComponent>
      );
    } else {
      return (
        <MotionComponent key={index} custom={custom} className={`text-reveal-element ${classes}`}>
          {line}
        </MotionComponent>
      );
    }
  });

  if (variant === "opacity") {
    return (
      <motion.div
        className="text-reveal-container"
        ref={ref}
        variants={opacity}
        initial="initial"
        animate={isVisible ? "open" : "closed"}
        custom={custom}
      >
        {lines}
      </motion.div>
    );
  } else if (elementClass.includes("title") || elementClass.includes("heading")) {
    return (
      <motion.div className="text-reveal-container" ref={ref} custom={custom}>
        {lines}
      </motion.div>
    );
  } else {
    return (
      <motion.div
        className="text-reveal-container"
        ref={ref}
        variants={paddingReveal}
        initial="initial"
        animate={isVisible ? "open" : "closed"}
      >
        {lines}
      </motion.div>
    );
  }
}

export default Reveal;
