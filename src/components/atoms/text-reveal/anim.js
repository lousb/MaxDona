import React from "react";
const transition = {duration: 1, ease:[0.76, 0, 0.24, 1]}


export const reveal = {
    initial: {
      y: '150%',
    },
    open: (i) => ({
      y: '0%',
      opacity: 1,
      transition: { ...transition, delay: i * 0.015 }, // Fix the delay calculation
    }),
    closed: (i) => ({
      y: '150%',
      opacity: 0,
      transition: 0, // Fix the delay calculation
    }),
  };