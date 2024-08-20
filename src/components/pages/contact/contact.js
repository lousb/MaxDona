import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import './contact.css';
import MouseCursor from "../../../utils/mouseCursor";
import gsap from "gsap";
import { useLocation } from "react-router-dom";
import Reveal from "../../../utils/textElementReveal/textElementReveal";
import ContactBlock from "../../molecules/ContactBlock/contactBlock";

function Contact(){


    let location = useLocation();

    useEffect(() => {

        gsap.fromTo(".contact-image-wrap .mask-image-wrap", { height:'0px' }, { height: '32vw', duration: 1, ease:[0.76, 0, 0.24, 1], delay:0.2});
        
    }, [location]);

    useEffect(()=>{
      document.documentElement.style.setProperty('--primary-color', '#181818');
      document.documentElement.style.setProperty('--secondary-dark', 'rgb(10, 10, 10)');
    }, [])

    const DynamicVideoPlayer = ({ image, isSection3Visible, windowWidth }) => {
        const maskRef = useRef(null);
        const imageRef = useRef(null);
        const [isHovered, setIsHovered] = useState(false);
        const initialObjectPosition = "center top"; // Initial object position
    
        const initialStyles = {
          width: "68.5vw",
          height: "100%", // Adjust the values accordingly
        };
      
        const handleMouseMove = (event) => {
          if (isHovered) {
            const rect = maskRef.current.getBoundingClientRect();
            const maskCenterX = rect.left + rect.width / 2;
            const maskCenterY = rect.top + rect.height / 2;
            const mouseX = event.clientX;
            const mouseY = event.clientY;
      
            const distanceX = mouseX - maskCenterX;
            const distanceY = mouseY - maskCenterY;
      
            // Adjust sensitivity based on initial object position
            const sensitivity = 0.015;
      
            // Calculate image position considering initial object position and sensitivity
            const imageX = distanceX * sensitivity;
            const imageY = distanceY * sensitivity;
    
    
            imageRef.current.style.objectPosition = `calc(50% + ${imageX}px) calc(0% + ${imageY}px)`;
    
          }
        };
    
        
      
        const handleMouseEnter = () => {
            imageRef.current.style.transition = "cubic-bezier(0.76, 0, 0.24, 1) all 700ms, object-position 0.5s ease"; // Enable transition for smooth hover effect
        
          setIsHovered(true);
          setTimeout (()=>{
            imageRef.current.style.transition = "cubic-bezier(0.76, 0, 0.24, 1) all 700ms, object-position 0s ease"; // Disable transition for smooth hover effect
        }, 600);
    
        };
      
        const handleMouseLeave = () => {
          setIsHovered(false);
          imageRef.current.style.transition = "cubic-bezier(0.76, 0, 0.24, 1) all 700ms, object-position 0.5s ease"; // Apply transition for smooth mouse leave effect
          imageRef.current.style.objectPosition = initialObjectPosition; // Reset object position on mouse leave
        };
      
        useEffect(() => {
          const mask = maskRef.current;
      
          mask.addEventListener("mousemove", handleMouseMove);
          mask.addEventListener("mouseenter", handleMouseEnter);
          mask.addEventListener("mouseleave", handleMouseLeave);
    
          if(isSection3Visible){
            maskRef.current.style.transition = 'none';
          }
      
          return () => {
            mask.removeEventListener("mousemove", handleMouseMove);
            mask.removeEventListener("mouseenter", handleMouseEnter);
            mask.removeEventListener("mouseleave", handleMouseLeave);
          };
        }, [isHovered, initialObjectPosition]);
      
    
        return (
          <div className={`mask-mouse-area`}>
     
            <div className="mask-image-wrap" ref={maskRef}>
            <div className="reference-peace-bg-gradient">
    
            </div>
              <img className="mask-image" src={image} style={initialStyles} ref={imageRef} alt="Franco" />
              <div className="details">
                <div className="player-project-name">
                  <p className="primary-button">
                    Instagram
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      };


    return(
        <div className="contact-page ">
            <div className="contact-top ">
                <div className="contact-heading-wrap high-z-index-layer">
                    <p className="contact-max-title heading">
                        AX DONA
                    </p>
                    <div className="contact-subtitle title">
                        <Reveal elementClass={'title'} element={'p'} textContent={'for all'}/>
                        <Reveal elementClass={'title'} element={'p'} textContent={'conversation-'}/>
                        <Reveal elementClass={'title'} element={'p'} textContent={'al purporses'}/>
                    </div>
                </div>
                <div className="contact-image-wrap">
                    <DynamicVideoPlayer image={'./maxPortrait.jpg'}/>
                  

                </div>
            </div>
            <ContactBlock/>
          


        </div>


    )
}


export default Contact;