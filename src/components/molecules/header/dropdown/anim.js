import React from "react";
const transition = {duration: 1, ease:[0.76, 0, 0.24, 1]}

// Define opacity animation variants with initial, open, and closed states
export const opacity = {
    initial:{
        opacity: 0
    },
    open:(i)=>({
        opacity:1,
        transition: {
            duration: i === 'svg-delay' ? 1 : 0.55,
            delay: i === 'svg-delay' ? 1 : 0.55
          }
    }),
    closed:(i)=>({
        opacity:0,
        transition: {
            duration: 0.55,
            delay: i === 'svg-delay' ? 0.4 : 0.1
          }
        
    })

    
}

export const SVGHeight ={
    initial:{
        marginTop:64,
        height:0
    },
    open:{
        height:'11.7vw',
        marginTop:10,
        transition: {...transition, delay:0.45}
    },
    closed:{
        height:0,
        marginTop:64,
        transition: {...transition}
    }
}
// Define height animation variants with initial, open, and closed states
export const height ={
    initial:{
        height:0
    },
    open:{
        height:'0vh',
        transition,
    },
    closed:{
        height:0,
        transition: {...transition, delay:0.5}
    }
}

// Define translate animation variants with initial, open, and closed states

export const translate ={
    initial:{
        y:'150%'
    },
    open:(i)=>({
        y:'0%',
        opacity:1,
        transition: {...transition, delay: i*0.03 + 0.05}
    }),
    closed:(i)=>({
        y:'150%',
        opacity:0,
        transition: {...transition, delay: i*0.01 + 0.1}

    })
}

// Define margintop animation variants with initial, open, and closed states
export const margintop = {
    initial: {
      y: '18px'
    },
    open: (i) => ({
        y: i === 0 ? '24px' : '18px',
      opacity: 1,
      transition: { ...transition }
    }),
    closed: (i) => ({
      y: '18px',
      opacity: i === 1 ? 1 : i,
      transition: { ...transition, delay:[0.2] },
      
    })
  };



  export const background ={
    initial:{
        y:'-100%'
    },
    open:{
        y:'0%',
        transition,
    },
    closed:{
        y:'-100%',
        transition: {...transition, delay:0.6}
    }
}