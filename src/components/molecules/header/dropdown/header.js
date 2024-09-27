import React, { useState, useEffect, useRef } from "react";
import styles from './header.module.css';
import { motion, AnimatePresence } from "framer-motion";
import { height, margintop, background } from "./anim";
import Nav from "./nav";
import Hamburger from "../../../../components/atoms/buttons/hamburger/hamburger.js";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import useMousePosition from "../../../../utils/useMousePosition.js";
import DelayLink from "../../../../utils/headerDelayLink.js";

function Header() {
  // State variables to manage header and navigation visibility
  const [isActive, setIsActive] = useState(false); // Header active (toggled) state
  const [isNavVisible, setIsNavVisible] = useState(false); // Navigation visibility state
  const { x, y, isOutside } = useMousePosition(".App");
  const [hoverDescWidth, setHoverDescWidth] = useState(0);
  const [hoverDescHeight, setHoverDescHeight] = useState(0);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const [currentDesc, setCurrentDesc] = useState("Introduction"); // Add state for current description
  const [wobble, setWobble] = useState({ translateY: 0, rotate: 0 }); // State for wobble effect
  const hoverDescRef = useRef(null);
  const wobbleTimeoutRef = useRef(null); // Ref to store the timeout

  
  
  let xPercent = 0;

  // Function to handle header toggling
  const handleHeaderToggle = () => {
    setIsActive((prevIsActive) => !prevIsActive); // Toggle isActive state
    setIsNavVisible(true); // Set navigation visibility to true
  };

  // Function called when navigation exit animation completes
  const handleNavExitComplete = () => {
    setIsNavVisible(false); // Set navigation visibility to false after exit animation
  };

// Handle Escape key press
const handleEscapeKeyPress = (event) => {
  if (event.keyCode === 27 && isActive) {
    setIsActive(false);
  }
};

useEffect(() => {
  if(isActive){
    const calculateVelocity = () => {
      const vx = x - prevX;
      const vy = y - prevY;
      setVelocity({ vx, vy });
      setPrevX(x);
      setPrevY(y);
    };

    calculateVelocity();
  }



}, [x, y]);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const maxTranslation = 5; 
const maxRotation = 2.5; 

useEffect(() => {
  if(isActive){
const wobbleEffect = {
  translateY: clamp(velocity.vy * 2, -maxTranslation, maxTranslation),
  rotate: clamp(velocity.vx * 2, -maxRotation, maxRotation),
};
setWobble(wobbleEffect);

if (wobbleTimeoutRef.current) {
  clearTimeout(wobbleTimeoutRef.current);
}

wobbleTimeoutRef.current = setTimeout(() => {
  setWobble({ translateY: 0, rotate: 0 }); // Reset to baseline
}, 100); 

return () => clearTimeout(wobbleTimeoutRef.current);
  }

}, [velocity]);


useEffect(()=>{
  gsap.to('.header-hover-desc', {
  width:document.querySelector('.link-desc > span').clientWidth,
  duration:0,
  });
  gsap.to('.header-hover-desc', {
  height:document.querySelector('.link-desc > span').clientHeight,
  duration:1,
  });
}, [currentDesc]);

useEffect(() => {
  const handleLocationChange = () => {
    setIsActive(false);
    gsap.to(styles["minimal-header-background"],{
      y:'-100%',
      duration:'0s !important',
      
    })
  };
  window.addEventListener("popstate", handleLocationChange);
  return () => {
    window.removeEventListener("popstate", handleLocationChange);
  };
}, []);

// Calculate width and height of hoverDesc element
useEffect(() => {
  const calculateHoverDescSize = () => {
    if (hoverDescRef.current) {
      const width = hoverDescRef.current.offsetWidth;
      const height = hoverDescRef.current.offsetHeight;
      setHoverDescWidth(width);
      setHoverDescHeight(height);
    }
  };

  calculateHoverDescSize(); // Initial calculation of hoverDescSize

  window.addEventListener("resize", calculateHoverDescSize);

  return () => {
    window.removeEventListener("resize", calculateHoverDescSize);
  };
}, []);



useEffect(() => {
  document.addEventListener("keydown", handleEscapeKeyPress);
  return () => {
    document.removeEventListener("keydown", handleEscapeKeyPress);
  };
}, [isActive]);



  return (
    // Framer Motion header element
    <motion.header
      key="header"
      variants={height} // Use the height animation variants
      initial='initial' // Set initial animation state
      animate={isActive ? 'open' : 'closed'} // Toggle between open and closed states
      exit='closed' // Animation state when header is being removed from the DOM
      className={`header ${styles["minimal-header"]} ${
        isActive ? styles["header-toggled"] : ''
      } ${isActive ?'header-toggled-global' : ''}`} // Set class names based on isActive state
      onExitComplete={handleNavExitComplete} // Callback when navigation exit animation completes
      
    >
      <div className={`header-wrap ${styles["header-wrap"]}`}>
        <div>
     

      <motion.div
        variants={background} // Use the height animation variants
        initial='initial' // Set initial animation state
        animate={isActive ? 'open' : 'closed'} // Toggle between open and closed states
        exit='closed' // Animation state when header is being removed from the DOM
        className={`minimal-header-background ${styles["minimal-header-background"]} ${
          isActive ? styles["header-toggled"] : ''
        }`} // Set class names based on isActive state
        onExitComplete={handleNavExitComplete} // Callback when navigation exit animation completes
      ></motion.div>
      {/* Inner content of the header */}


      <motion.div
        variants={margintop} // Use the margintop animation variants
        initial="initial" // Set initial animation state
        animate={!isActive ? 'closed' : 'open'} // Toggle between open and closed states
        className={`header-inner-content ${styles["header-inner-content"]}`} // Set class name for inner content
      >
        {/* Header logo */}
        <div className={styles["header-logo"]}>
        <DelayLink
            className='header-logo-link '
            to={`/`} // Specify the destination link here
            delay={2000} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
          >
            <img className="header-logo" src="/LOGO-DESKTOP.svg" alt="Logo" ></img>
            <div className="header-logo" ></div>
          </DelayLink>

            


        </div>

        {/* Hamburger menu icon */}
        <div className={`${styles["header-cta-wrap"]}`}>
        <a
         href={`/contact`} // Specify the destination link her
         >
          <div className={`primary-button header-hero-cta ${styles["header-hero-cta"]}`}>
            Let's Work
          </div>
          </a>

          <div
            className={`${styles["header-hamburger"]} header-hamburger`}
            onClick={handleHeaderToggle} // Call handleHeaderToggle when clicked
          >
            <Hamburger isActive={isActive} /> {/* Pass isActive prop to Hamburger component */}
          </div>
        </div>

      </motion.div>
      </div>
      </div>
        
      <div
        className={`header-hover-desc ${styles["header-hover-desc"]}`}
        ref={hoverDescRef}
        style={{
          position: "fixed",
          left: `${x - 14}px`,
          top: `${y - hoverDescHeight / 2}px`,
          transform: `translateY(${wobble.translateY}px) rotate(${wobble.rotate}deg)`,
          
        }}
      >
        <p className={`body link-desc ${styles["link-desc"]}`}>
        <span  dangerouslySetInnerHTML={{ __html: currentDesc }}>
         
        </span>
        </p>
      </div>

      {/* Render the Nav component */}
      <Nav isActive={isActive} setIsActive={setIsActive} setCurrentDesc={setCurrentDesc}/> {/* Pass isActive prop to Nav component */}
    </motion.header>
  );
}

export default Header;
