import React, { useState, useRef, useEffect } from "react";
import styles from './footer.module.css';
import { motion } from "framer-motion";
import { translate } from "./anim";

function FooterSmall() {

    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);
  
    useEffect(() => {
      const options = {
        threshold: 0.001 // Trigger when 30% of the footer is visible
      };
  
      const observer = new IntersectionObserver(([entry]) => {
        setIsVisible(entry.isIntersecting);
      }, options);
  
      if (footerRef.current) {
        observer.observe(footerRef.current);
      }
  
      return () => {
        if (footerRef.current) {
          observer.unobserve(footerRef.current);
        }
      };
    }, []);
    
    const currentYear = new Date().getFullYear();

    const handleBackToTop = () => {
        const scrollContainer = document.querySelector('.scroll-container');
        if (scrollContainer) {
          scrollContainer.scrollTop = 0;
        }
      };


  return (
    <footer className={`${styles["footer"]} ${isVisible ? "visible" : ""}`} ref={footerRef}>
        <div className={styles["footer-wrap"]}>
            <div className={styles["footer-col-1"]}>
                <div className={styles["header-logo"]}>
                  <a href="/">
                  <img src="/LOGO-DESKTOP.svg" alt="Logo"></img>
                  </a>
                    
                </div>
                {
                  window.innerWidth > 830 &&
                  <div className={styles["country-wrap"]}>
                      <div className={styles["flag-wrap"]}>
                          <img className={styles["flag"]} src='/icons/Minimal-Aus.svg' alt="Australian Flag" />
                          <img className={styles["flag"]} src='/icons/Minimal-Indigenous.svg' alt="Indigenous Flag" />
                      </div>
                  </div>
                }
                
            </div>
            <div className={`${styles["footer-col-2"]} body`}>
                <a href="/">Home</a>
                <a href="/#/about">About</a>
            </div>
            <div className={`${styles["footer-col-3"]} body`}>
                <a href="/#/archive">Archive</a>
                <a href="/#/contact">Contact</a>
  

     
            </div>
            <div className={`${styles["footer-col-4"]} body`}>
                
                <a href="/#/reference-peace">Reference Peace</a>
                <a>Max Dona © {currentYear}</a>

                {
                  window.innerWidth <= 830 &&
                  <div className={styles["country-wrap"]}>
                      <div className={styles["flag-wrap"]}>
                          <img className={styles["flag"]} src='/icons/Minimal-Aus.svg' alt="Australian Flag" />
                          <img className={styles["flag"]} src='/icons/Minimal-Indigenous.svg' alt="Indigenous Flag" />
                      </div>
                  </div>
                }
            </div>
        
        </div>
    </footer>
  );
}

export default FooterSmall;
