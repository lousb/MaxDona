import { easeIn, easeOut } from "framer-motion";
import React from "react";
const transition = {duration: 1, ease:[0.76, 0, 0.24, 1]}


export const reveal = {
    initial: {
      y: '130%',
    },
    open: (i) => ({
      y: '0%',
      transition: { ...transition, duration:2 , delay:i > 0 ? (i / 16 - 1) : -0.5 }, // Fix the delay calculation
    }),
    closed: (i) => ({
      y: '130%',
      transition: 0, // Fix the delay calculation
    }),
  };

  export const paddingReveal = {
    initial: {
      y:10,
      clipPath: 'polygon(0 0, 100% 0%, 100% 0, 0 0)',
      transition: { ...transition, delay:0.5}
    },
    open: (i) => ({
      y:0,
      clipPath: 'polygon(0 0, 100% 0%, 100% 100%, 0 100%)',
      transition: { duration:1, delay:i>0 ? (i / 4) : 0.4, ease:[0.76, 0, 0.24, 1]}
    }),

    closed: (i) => ({
      y:10,
      clipPath: 'polygon(0 0, 100% 0%, 100% 0, 0 0)',
      transition: {duration:0}
    }),
  }

  export const opacity = {
    initial: {
      opacity:0
    },
    open: (i) => ({
      opacity:1,
      transition: { duration:0.5, delay:i>0 ? (i / 4) : 0.2, ease:easeIn}
    }),

    closed: (i) => ({
      opacity:0,
      transition: {duration:0, delay:0, ease:easeIn}
    }),
  }