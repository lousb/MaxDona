import { easeOut } from "framer-motion";

const transition = {duration: 1, ease:[0.76, 0, 0.24, 1]}


export const reveal = {
    initial: {
      y: '120%',
    },
    open: (i) => ({
      y: '0%',
      opacity: 1,

      transition: { ...transition, delay:0.1 + (i/8), duration: 1}, // Fix the delay calculation
    }),
    closed: (i) => ({
      y: '120%',
      opacity: 0,
      transition: 0, // Fix the delay calculation
    }),
  };

  export const height = {
    initial: {
      paddingBottom:'0px',
    },
    open: (i) => ({
      paddingBottom: '132px',

      transition: { duration:1, ease:easeOut}, // Fix the delay calculation
    }),
    closed: (i) => ({
      paddingBottom:'0px',
      transition: { ...transition, duration: 1}, // Fix the delay calculation
    }),
  };



  export const opacity = {
    initial: {
      opacity:0,
    },
    open: (i) => ({
      opacity:1,

      transition: { ...transition, duration: 0.5}, // Fix the delay calculation
    }),
    closed: (i) => ({
      paddingBottom:'0px',
      transition: { ...transition, duration: 1}, // Fix the delay calculation
    }),
  }