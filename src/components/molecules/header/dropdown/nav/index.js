import React, { useState, useEffect } from "react";
import styles from './../header.module.css';
import { motion, AnimatePresence } from "framer-motion";
import { opacity, translate, margintop, SVGHeight } from "../anim";
import Clock from "../../../../atoms/Clock/clock";

function Nav({ isActive }) {

  const socialLinks = [
    { text: "Contact", link: "/#/contact" },
    { text: "Instagram", link: "https://www.instagram.com/" },
    { text: "Youtube", link: "https://www.youtube.com/" },
  ];

  const navigationLinks = [
    { text: "Home", link: "/" },
    { text: "About", link: "/#/about" },
    { text: "Archive", link: "/#/films" },
    { text: "Contact", link: "/#/contact" },
    { text: "Reference Peace", link: "/#/reference-peace", class:'reference-peace-link' },
  ];

  const maxLinkCount = Math.max(navigationLinks.length, socialLinks.length);






  const generateAnchorTags = (links) => {
    return Array.from({ length: maxLinkCount }, (_, index) => {
      const { text = '', link = '#' } = links[index] || {};
      const isEmptyLink = text.trim() === '';
      const linkClassName = `${styles["header-subtext-link"]} primary-button ${isEmptyLink ? styles["empty-menu-link"] : ''}`;
      return (
        <a className={linkClassName} href={link} key={index}>
          {isEmptyLink ? '' : text}
        </a>
      );
    });
  };

  return (
    <div className={styles["header-menu"]}>
      <div className={styles["header-menu-links"]}>

      <div className={`${styles['reference-peace-sticker']}`}>
            <div className={`${styles['reference-peace-sticker-top']}`}>
                <span className="body sticker-top-line">
                  A Max Dona
                </span>
                <span className="body sticker-top-line">
                  Coming Soon
                </span>
                <span className="body sticker-top-line">
                  Click to find
                </span>
                <span className="body sticker-top-line">
                  A Max Dona
                </span>
            </div>
            <div className={`${styles['reference-peace-sticker-bottom']}`}>
              <div className={`${styles['reference-peace-sticker-bottom-left']}`}>
                <span className="body sticker-bottom-left-line">
                  Magazine
                </span>
                <span className="body sticker-bottom-left-line">
                  Early 2024
                </span>
                <span className="body sticker-bottom-left-line">
                  Out More
                </span>
                <span className="body sticker-bottom-left-line">
                  Magazine
                </span>
              </div>
              <div className={`${styles['reference-peace-sticker-bottom-asterix']} reference-peace-sticker-bottom-asterix body`}>
                *
              </div>
            </div>
          </div>
        {/* Render the navigation menu links */}
        {navigationLinks.map((linkObj, index) => (
          <a className={`${styles["header-menu-link"]}`} href={linkObj.link} key={linkObj.text}>
            <motion.span custom={index} initial="initial" variants={translate} animate={!isActive ? 'closed' : 'open'}>
              {linkObj.text}
            </motion.span>
          </a>
        ))}

      
        
      </div>
      <div className={styles["header-menu-subtext"]}>
        {/* Subtext columns */}
        <div className={styles["header-menu-subtext-col-1"]}>
          <div className={styles["header-menu-subtext-links"]}>
            <motion.div custom={1} variants={opacity} animate={!isActive ? 'closed' : 'open'} className={`${styles["menu-time-wrap"]} ${ !isActive ? styles["empty-menu-link"] : ''}`}>
              <Clock />
            </motion.div>
            {generateAnchorTags(socialLinks)}
            <br/>
              <a className={`${styles["header-subtext-link"]} primary-button`}>
                English
              </a>
              <a className={`${styles["header-subtext-link"]} primary-button`}>
                French
              </a>
              <a className={`${styles["header-subtext-link"]} primary-button`}>
                Japanese
              </a>
            <br/>
              <a className={`${styles["header-subtext-link"]} primary-button`}>
                  Theme
                </a>
                <a className={`${styles["header-subtext-link"]} primary-button`}>
                  Retro Mode
                </a>
                <a className={`${styles["header-subtext-link"]} primary-button`}>
                  Motion
                </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
