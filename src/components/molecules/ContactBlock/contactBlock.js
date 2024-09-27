import React, { useEffect, useRef, useState } from "react";
import styles from './contactBlock.module.css'
import useMousePosition from "../../../utils/useMousePosition";
import './contactBlock.css';
import gsap from "gsap";

const ContactBlock = ({ referencePeace = false }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText("maxdona@gmail.com");

        gsap.to('.contact-hover-desc .link-desc > span', {
          y: '100%',
          duration: 0.3,
          delay: 0,
          onComplete:()=>{
            setCopyLinkDesc('Email Copied');
            gsap.to('.contact-hover-desc .link-desc > span', {
              y: '0%',
              duration: 0.3,
              delay: 0,
            });
          }
        });
    };

    const [hoverDescHeight, setHoverDescHeight] = useState(0);
    const [prevX, setPrevX] = useState(0);
    const [prevY, setPrevY] = useState(0);
    const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
    const [currentProject, setCurrentProject] = useState(''); // Initialize with first item's focusGenre
    const [wobble, setWobble] = useState({ translateY: 0, rotate: 0 }); // State for wobble effect
    const hoverDescRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [copyLinkDesc, setCopyLinkDesc] = useState('Click to Copy');

    const wobbleTimeoutRef = useRef(null); // Ref to store the timeout


    let {x, y} = useMousePosition('.App');



    const [data, setData] = useState([]);

    const [prevHover, setPrevHover] = useState([data[0]]);

    useEffect(()=>{
      gsap.to('.contact-hover-desc', {
      width:document.querySelector('.contact-hover-desc .link-desc > span').clientWidth,
      duration:0,
      });
      gsap.to('.contact-hover-desc', {
      height:document.querySelector('.contact-hover-desc .link-desc > span').clientHeight,
      duration:1,
      });
    }, [copyLinkDesc]);

const handleProjectItemMouseEnter = () => {
    setIsHovered(true);
    setCopyLinkDesc('Click to Copy');

    gsap.to('.contact-hover-desc .link-desc > span', {
      y: '0%',
      opacity: 1,
      duration: 0.3,
      delay: 0.3,
    });
};

const handleMouseLeave = () => {
    setIsHovered(false);
};


    useEffect(() => {
      if (!isHovered) return;


        const calculateVelocity = () => {
          const vx = x - prevX;
          const vy = y - prevY;
          setVelocity({ vx, vy });
          setPrevX(x);
          setPrevY(y);
        };

        calculateVelocity();




    }, [x, y, isHovered]);

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const maxTranslation = 3; 
    const maxRotation = 1.5; 


    useEffect(() => {
      if (!isHovered) return;

    const wobbleEffect = {
      translateY: clamp(velocity.vy * 1.5, -maxTranslation, maxTranslation),
      rotate: clamp(velocity.vx * 1.5, -maxRotation, maxRotation),
    };
    setWobble(wobbleEffect);

    if (wobbleTimeoutRef.current) {
      clearTimeout(wobbleTimeoutRef.current);
    }

    wobbleTimeoutRef.current = setTimeout(() => {
      setWobble({ translateY: 0, rotate: 0 }); // Reset to baseline
    }, 100); // Reset after 100ms of inactivity

    return () => clearTimeout(wobbleTimeoutRef.current);


    }, [velocity, isHovered]);



  

    return (
        <section className={`${styles["about-page-section-3"]} contact-block-wrap high-z-index-layer`}>
            <div
              className={`contact-hover-desc`}
              ref={hoverDescRef}
              style={{
                position: "fixed",
                left: `${x - 14}px`,
                top: `${y - hoverDescHeight / 2}px`,
                transform: `translateY(${wobble.translateY}px) rotate(${wobble.rotate}deg)`,
              }}
             
            >
              <div className="contact-hover-svg-wrap">
                <svg width="17" height="25" viewBox="0 0 17 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="contact-hover-arrow">
                <path style={{ fill: `#000000` }} fill-rule="evenodd" clip-rule="evenodd" d="M2.0078 4.99998H0.29C0.193334 4.99998 0 4.95453 0 4.77271V0.22727C0 0 0.348 0 0.580001 0H1.74023H6.38H6.38086H8.12023H11.2382H12.1809H16.2405V4.63965V6.37983V10.4395V10.4473H16.2435V16.2471C16.2435 16.4791 16.2435 16.8271 16.0053 16.8271H11.2411C11.0506 16.8271 11.0029 16.6338 11.0029 16.5371V10.7739C11.0009 10.7578 11 10.7427 11 10.7295V8.99603L6.39529 13.6006L6.39552 13.6008L3.92365 16.0726C3.82477 16.1715 3.67646 16.3198 3.50954 16.1529L0.171188 12.8146C0.037654 12.6811 0.0866662 12.5653 0.127864 12.5241L1.48753 11.1645L1.4873 11.1642L7.65128 5.00047H2.03023C2.02257 5.00047 2.01509 5.0003 2.0078 4.99998Z" fill="#181818"/>
                </svg>
              </div>

              <p className={`body link-desc`}>

                <span>{copyLinkDesc}</span>
              </p>
            </div>
            <div className={`${styles["about-last-cta-wrap"]}`}>
                <div className={`${styles["about-last-cta-top"]}`}>
                    <p className={`body ${styles["body"]}  ${styles["first"]}`}>
                        Contact
                    </p>
                    <p className={`body ${styles["body"]}`} style={{width : '220px'}}>
                    {referencePeace && (
                        <>
                          Submit your project, artwork & passion to be featured in reference peace.
                          <br /><br />
                        </>
                      )}
                      Click my email<br/>
                        To get in touch!
                    </p>
                </div>

                <div className={`heading about-last-cta-wrap-heading ${styles["about-last-cta-wrap-heading"]}`} onMouseEnter={handleProjectItemMouseEnter}
                onMouseLeave={handleMouseLeave}>
                    <a className="heading" onClick={copyToClipboard}><span className="white-char">M</span>axdona@gmail.com</a>
                    <img src="/LOGO-DESKTOP.svg" alt='logo-desktop' />
                </div>
            </div>
        </section>
    );
};

export default ContactBlock;
