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
    <footer className={`${styles["footer"]} ${isVisible ? "visible" : ""}`} ref={footerRef} ref={footerRef}>
        <div className={styles["footer-wrap"]}>
            <div className={styles["footer-col-1"]}>
                <div className={styles["header-logo"]}>
                    <img src="/LOGO-DESKTOP.svg" alt="Logo"></img>
                </div>
            </div>
            <div className={styles["footer-col-2"]}>
                <a>Home</a>
                <a>About</a>
            </div>
            <div className={styles["footer-col-3"]}>
                <a>Gallery</a>
                <a>Contact</a>
  

     
            </div>
            <div className={styles["footer-col-4"]}>
                <a>Site Name © {currentYear}</a>
                <a>A Wyeth Site</a>
            </div>
        
        </div>
    </footer>
  );
}

export default FooterSmall;
