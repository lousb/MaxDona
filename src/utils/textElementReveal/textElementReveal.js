import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { motion } from "framer-motion";
import { reveal, paddingReveal, opacity } from "./anim";
import { useLoading } from "../LoadingContext";

function Reveal({ textContent, element, elementClass = "", custom, variant }) {
  const [isVisible, setIsVisible] = useState(false);
  const [delayPassed, setDelayPassed] = useState(false); // New state for delay
  const ref = useRef(null);
  const { isLoading } = useLoading();

  useEffect(() => {
    let delayTimeout;
    if (isLoading) {
      setDelayPassed(false);
      delayTimeout = setTimeout(() => {
        setDelayPassed(true); // Delay of 200ms before setting delayPassed to true
      }, 600);
    } else {
      setDelayPassed(true);
    }

    const handleScroll = () => {
      if (ref.current && delayPassed) {
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
  }, [isLoading, delayPassed]);

  const MotionComponent = motion[element] || motion.div;

  const variants = {
    initial: "initial",
    open: "open",
    closed: "closed",
  };

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