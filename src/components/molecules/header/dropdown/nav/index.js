import React, { useState, useEffect } from "react";
import styles from './../header.module.css';
import { motion, AnimatePresence } from "framer-motion";
import { opacity, translate, margintop, SVGHeight, height } from "../anim";
import Clock from "../../../../atoms/Clock/clock";
import DelayLink from "../../../../../utils/headerDelayLink";
import { gsap } from "gsap";

function Nav({ isActive, setIsActive, setCurrentDesc }) {

const handleDelayStart = (e, to) => {
  setIsActive(false);
  document.documentElement.style.setProperty('--secondary-dark', 'rgb(10, 10, 10)');
  document.documentElement.style.setProperty('--primary-color', '#181818');
};

const handleDesc = (desc) =>{
  gsap.to('.link-desc > span', {
    y:'100%',
    duration:0.3,
    onComplete:()=>{
      setCurrentDesc(desc);
      gsap.to('.link-desc > span', {
        y:'100%',
        opacity:0,
        duration:0,

        onComplete:()=>{
          gsap.to('.link-desc > span', {
            y:'0%',
            opacity:1,
            duration:0.3,
            delay:0.3,
         
          });

      
        }
      });
     
    }
  })
 
 
}

const handleDelayEnd = (e, to) => {
  console.log("Delay end triggered for:", to);
};

  const socialLinks = [
    { text: "Contact", link: "/#/contact" },
    { text: "Instagram", link: "https://www.instagram.com/" },
    { text: "Youtube", link: "https://www.youtube.com/" },
  ];

  const navigationLinks = [
    { text: "Home", link: "/", desc:'Introduction' },
    { text: "About", link: "/#/about", desc:'Get to<br/>know me'  },
    { text: "Archive", link: "/#/films", desc:'My Projects'  },
    { text: "Contact", link: "/#/contact",  desc:'Get in Touch' },
    { text: "Reference Peace", link: "/#/reference-peace", desc:'A Max Dona<br/>Magazine', class:'reference-peace-link' },
  ];

  const maxLinkCount = Math.max(navigationLinks.length, socialLinks.length);






  const generateAnchorTags = (links) => {
    return Array.from({ length: maxLinkCount }, (_, index) => {
      const { text = '', link = '#' } = links[index] || {};
      const isEmptyLink = text.trim() === '';
      const linkClassName = `${styles["header-subtext-link"]} header-subtext-link primary-button ${isEmptyLink ? styles["empty-menu-link"] : ''}`;
      return (
        <a className={linkClassName} href={link} key={index}>
          {isEmptyLink ? '' : text}
        </a>
      );
    });
  };

  return (
    <div className={`header-menu ${styles["header-menu"]}`}>
      <div className={styles["header-menu-links"]}>

     
        {/* Render the navigation menu links */}
        {navigationLinks.map((linkObj, index) => (
         <DelayLink
           className={`header-menu-link ${styles["header-menu-link"]}`}
           delay={1500} // 1.5 seconds delay
           onDelayStart={handleDelayStart}
           onDelayEnd={handleDelayEnd}
           onMouseEnter={() => handleDesc(linkObj.desc)} // Update currentDesc on hover
           to={linkObj.link}
           key={linkObj.text}
         >
           <motion.span custom={0} initial="initial" variants={translate} animate={!isActive ? 'closed' : 'open'}>
             {linkObj.text}
           </motion.span>
         </DelayLink>
        ))}

      
        
      </div>
      <div className={`${styles["header-menu-subtext"]}`}>
        {/* Subtext columns */}
        <div className={styles["header-menu-subtext-col-1"]}>
          <div className={`header-menu-subtext-links ${styles["header-menu-subtext-links"]}`}>
            <motion.div custom={1} variants={opacity} animate={!isActive ? 'closed' : 'open'} className={`${styles["menu-time-wrap"]} ${ !isActive ? styles["empty-menu-link"] : ''}`}>
              <Clock />
            </motion.div>
            {generateAnchorTags(socialLinks)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
