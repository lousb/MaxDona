import React, { useState, useRef, useEffect } from "react";
import styles from './footer.module.css';
import { motion } from "framer-motion";
import { translate } from "./anim";
import {Clock} from "../../../atoms/Clock/clock";
import Reveal from "../../../atoms/text-reveal";


function FooterDefault() {

    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);
  
    useEffect(() => {
      const options = {
        threshold: 0.1 // Trigger when 30% of the footer is visible
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


  return (
    <footer className={`${styles["footer"]} ${isVisible ? "visible" : ""}`}   ref={footerRef}>
        <div className={styles["footer-wrap"]}>
            <div className={styles["footer-col-1"]}>
                {/* <div className={styles["header-logo"]}>
                    <img src="/LOGO-DESKTOP.svg" alt="Logo"></img>
                    <div className={styles["footer-clock-wrap"]}>
                        <Clock/>
                    </div>

                </div> */}
                <div className={styles["find-me-wrap"]}>
                    <div className={styles["footer-title"]}>
                        Find Me
                    </div>
                    <a className="primary-button">Instagram</a>
                    <a className="primary-button">Youtube</a>
                    <a className="primary-button">Contact</a>
                </div>
                <div className={styles["country-wrap"]}>
                    <div className={styles["flag-wrap"]}>
                        <img className={styles["flag"]} src='/icons/Minimal-Aus.svg'/>
                        <img className={styles["flag"]} src='/icons/Minimal-Indigenous.svg'/>
                    </div>
                    <div className={styles["acknowledgement-of-country"]}>
                    I respectfully acknowledge the Gadigal people of the Eora Nation as the Traditional Custodians of the land I operate upon. I extend that respect to elders, both past, present & emerging. 
                    </div>
                </div>
                <div className={styles["retro-mode-wrap"]}>
                    <a className="primary-button ">Retro Mode</a>
                </div>
            </div>
            <div className={styles["footer-col-2"]}>
            </div>
            <div className={styles["footer-col-3"]}>
                <div className={styles["footer-archive-div"]}>
                    2023
                </div>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <div className={styles["footer-archive-div"]}>
                    2023
                </div>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
            </div>
            <div className={styles["footer-col-4"]}>
                <div className={styles["footer-archive-div"]}>
                    2021
                </div>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <div className={styles["footer-archive-div"]}>
                    2020
                </div>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                <a className="primary-button">Link Example</a>
                {/* <a>Site Name © {currentYear}</a>
                <a>A Wyeth Site</a>
                <div className={styles["back-to-top"]}>
                    <Reveal onClick={handleBackToTop} textContent={'Back to Top'} element={"a"} elementClass={"footer-link"}/>
                </div> */}
    
            </div>
         
        
        </div>
        <div className={styles["bottom-footer-area"]}>
            <div className={styles["footer-col-1"]}>
                <div className={styles["footer-logo"]}>
                    <a className='footer-logo-link 'href='/'>
                        <img className="footer-logo" src="/LOGO-DESKTOP.svg" alt="Logo" ></img>
                    </a>
                </div>
            </div>
            <div className={styles["footer-col-2"]}>
            <div className={styles["acknowledgement-of-country"]}>
                    <a>
                        English
                    </a>
                    <a>
                        French
                    </a>
                    <a>
                        Japanese
                    </a>
                </div>
                <div className={styles["acknowledgement-of-country"]}>
                    Max Dona © 2023<br/>
                    A Wyeth Site.
                </div>
            </div>
        </div>
    </footer>
  );

}



export default FooterDefault;
