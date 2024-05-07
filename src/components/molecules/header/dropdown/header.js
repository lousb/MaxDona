import React, { useState, useEffect } from "react";
import styles from './header.module.css';
import { motion, AnimatePresence } from "framer-motion";
import { height, margintop, background } from "./anim";
import Nav from "./nav";
import Hamburger from "../../../../components/atoms/buttons/hamburger/hamburger.js";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import DelayLink from "../../../../utils/delayLink";

function Header() {
  // State variables to manage header and navigation visibility
  const [isActive, setIsActive] = useState(false); // Header active (toggled) state
  const [isNavVisible, setIsNavVisible] = useState(false); // Navigation visibility state
  
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

    // Function to handle Escape key press
    const handleEscapeKeyPress = (event) => {
      if (event.keyCode === 27 && isActive) {
        setIsActive(false);
      }
    };

    useEffect(() => {
      if(isActive){
        // Add event listener when the component mounts
        document.addEventListener("keydown", handleEscapeKeyPress);
        requestAnimationFrame(animation);
        // Cleanup: Remove event listener when the component unmounts
        return () => {
          document.removeEventListener("keydown", handleEscapeKeyPress);
        };
      }else{
        xPercent = 0;
        setTimeout(()=>{
          gsap.to('.sticker-top-line, .sticker-bottom-left-line', {
            y: `${xPercent}%`,
  
          });
        },200)
      }
     
    }, [isActive]); // Re-run effect when isActive changes
  
    const animation = () => {
      
      if (isActive) {
        if (xPercent >= 400) {
          xPercent = 0;
          gsap.to('.sticker-top-line, .sticker-bottom-left-line', {
            y: `${xPercent}%`,
            duration: 0,
            onComplete: () => {
              requestAnimationFrame(animation);
            }
          });
  
        } else {

          gsap.to('.reference-peace-sticker-bottom-asterix', {
            rotation: '+=360',
            duration: 1.5,
          });
   
          gsap.to('.sticker-top-line', {
            y: `-${xPercent}%`,
            duration: 2,
          });

          gsap.to('.sticker-bottom-left-line', {
            y: `-${xPercent}%`,
            duration: 2,
            delay:0.05,
            onComplete: () => {
              requestAnimationFrame(animation);
              xPercent += 100;
            }
          });


       
        }
      }
    }

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

      <motion.div
        variants={background} // Use the height animation variants
        initial='initial' // Set initial animation state
        animate={isActive ? 'open' : 'closed'} // Toggle between open and closed states
        exit='closed' // Animation state when header is being removed from the DOM
        className={`${styles["minimal-header-background"]} ${
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
          <a className='header-logo-link 'href='/'>
            <img className="header-logo" src="/LOGO-DESKTOP.svg" alt="Logo" ></img>
          </a>

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

      

      {/* Render the Nav component */}
      <Nav isActive={isActive} /> {/* Pass isActive prop to Nav component */}
    </motion.header>
  );
}

export default Header;
