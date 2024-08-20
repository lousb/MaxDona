import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import './home.css';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Reveal from "../../../utils/textElementReveal/textElementReveal";
import SvgComponent from "../../atoms/referencePeaceSVG/referencePeaceSVG";
import { projectNavData } from "./projectNavDetails";

import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from '../../../firebase/firebase';

import { useLocation } from "react-router-dom";
import DelayLink from "../../../utils/delayLink";
import useMousePosition from "../../../utils/useMousePosition";
import useFetchFeaturedProjects from "./fetchFeaturedList";
import useRealtimeFeaturedProjects from "./fetchFeaturedList";
import ContactBlock from "../../molecules/ContactBlock/contactBlock";


gsap.registerPlugin(ScrollTrigger);

function Home() {

    const imageRef = useRef(null);
    const welcomeSectionRef = useRef(null);
    const aboutReferenceSectionRef = useRef(null);
    const section3Ref = useRef(null);
     const [pageHeight, setPageHeight] = useState(0);
 const firstThreeSectionsRef = useRef(null);

    const [isSection3Visible, setIsSection3Visible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    let xPercent = 0;
    let direction = -1;

  

    const [hoveredItem, setHoveredItem] = useState(null);

    const handleHoverChange = (item) => {
      gsap.to('.player-project-name span',{
        y:'150%',
        duration:0.5,
        ease:'ease-in-out',

        onComplete: ()=>{
          setHoveredItem(item);
          gsap.to('.player-project-name span',{
          y:'0%',
          
       
          })
        }
      })

    };


    useEffect(() => {
      document.documentElement.style.setProperty('--primary-color', '#181818');
      document.documentElement.style.setProperty('--secondary-dark', 'rgb(10, 10, 10)');
      
      return () => {
        window.scrollTo(0, 0);
      };
    }, []); 

    
    useLayoutEffect(() => {
      const handleResize = () => {
        const newWindowWidth = window.innerWidth;
        const newWindowHeight = window.innerHeight;
    
        setWindowWidth(newWindowWidth);
        setWindowHeight(newWindowHeight);
      };
    
      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(document.body);
    
      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    useLayoutEffect(() => {

      const triggers = [];
        


      gsap.fromTo('.scroll-notification', {
        opacity:0,
      },{
        opacity:1,
        delay:0.1,
      })
      
      const sectionOneScrollTrigger = () => {
           triggers.push(ScrollTrigger.create({
          trigger: ".page-one",
          start: "top top",
          pin: ".dynamic-video-player-1",
          pinSpacer:false,
          end: () => welcomeSectionRef.current.offsetTop + welcomeSectionRef.current.clientHeight - windowHeight - 120,
        })
      );
      };
  
      const pageFiveScrollTrigger = () => {
        triggers.push(ScrollTrigger.create({
          trigger: aboutReferenceSectionRef.current,
          pin: '.page-five',
          start:()=> `-${windowHeight*2 - windowWidth * 0.08 + 80 } top`,
          pinSpacer:false,
          end: 'bottom bottom',
        }));
      };



      const handleMinWidth831 = () => {
        // gsap.to(".dynamic-video-player-1 .mask-image", { maxWidth: "68.5vw",         width: 'calc(68.5vw)', });

        const aboutReferenceSectionScrollTrigger = () => {
          triggers.push(ScrollTrigger.create({
            trigger: aboutReferenceSectionRef.current,
            start: `-84px top`,
            pin: '.dynamic-video-player-5',
            pinSpacer:false,
            end: 'bottom bottom',
          }));
        };
         gsap.to(".page-five-right", {
          clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
   
          scrollTrigger: {
            trigger: '.page-six',
            start: "-710px top",
            end: "-550px top",
            scrub: 1,
            id: "scrub",
            
          },
        });
  
        gsap.fromTo(".dynamic-video-player-1 .mask-image", { width:'calc(68.5vw)'}, {
          width: "45.3vw",
          scrollTrigger: {
            start: "top top",
            end: "80vh",
            scrub: 2,
            id: "scrub",
            trigger: welcomeSectionRef.current,
          },
        });
  
        gsap.fromTo(".dynamic-video-player-1 .mask-image-wrap, .dynamic-video-player-1 .mask-mouse-area", {
          height: 'calc(100vh - 4vw - 164px)',
  
        },{
          height: 'calc(100vh - 4vw - 84px)',
          scrollTrigger: {
            trigger: welcomeSectionRef.current, 
            start: 'top top',
            end: '100vh',
            scrub: 2,
            id: "scrub",
          },
        });

        gsap.to(".inner-asterix", {
          rotate:'-200deg',
          transformOrigin:'center',
          scrollTrigger: {
            trigger: '.page-six',
            start: '-92px top',
            end: 'bottom bottom',
            scrub: true,
            id: "scrub",
            onUpdate: e => direction = e.direction * -1
          },
        });

        gsap.to(".dynamic-video-player-5 .mask-image", {
          width: "92vw",
          scale:2,
          transformOrigin:'top left',
          scrollTrigger: {
            trigger: '.page-six',
            start: "-610px top",
            end: "-550px top",
            scrub: 2,
            id: "scrub",
          },
    
        });

        gsap.to(".mask-image, .scroll-video", {
          '-webkit-filter':'blur(10px)',
          filter: 'blur(10px)',
          transformOrigin:'top left',
          scrollTrigger: {
            trigger: '.page-six',
            start: "-610px top",
            end: "-550px top",
            scrub: 2,
            id: "scrub",
          },

        });

        gsap.to(".dynamic-video-player-4.middle .mask-image", {
          width: "92vw",
          transformOrigin:'top left',
          scale:1.5,
          scrollTrigger: {
            trigger: '.page-six',
            start: "-610px top",
            end: "-550px top",
            scrub: 2,
            id: "scrub",
          },

        });


        gsap.to(".dynamic-video-player-5 .mask-image-wrap", {
  
          width: "92vw",
          minWidth:"92vw",
          scrollTrigger: {
            trigger: '.page-six',
            start: "-600px top",
            end: "-550px top",
            scrub: 2,
            id: "scrub",
          },
        });

        gsap.to(".dynamic-video-player-4.middle .mask-image-wrap", {

          width: "68.7vw",
          minWidth:"68.7vw",
          scrollTrigger: {
            trigger: '.page-six',
            start: "-600px top",
            end: "-550px top",
            scrub: 4,
            id: "scrub",
          },
        });
    

        gsap.to(".reference-peace-bg-gradient", {
          y: "-50%",
          scrollTrigger: {
            trigger: '.page-six',
            start: "-200px top",
            end: "400px top",
            scrub: true,
            id: "scrub",
          },
        });

        gsap.to(".page-three", {
          y: -60,
          scrollTrigger: {
            trigger: '.page-four', 
            start: () => `-${window.innerHeight * 1.5} top`,
            end: () =>  windowWidth/0.4,
            scrub: 1,
            id: "scrub",
          },
        });
        gsap.to(".dynamic-video-player-1 .mask-mouse-area", {
          y: 20,
          scrollTrigger: {
            trigger: '.page-four', 
            start: () => `-${window.innerHeight * 1.5} top`,
            end: () =>  windowWidth/0.4,
            scrub: 1,
            id: "scrub",
      
          },
        });
    
        
        pageFiveScrollTrigger();
        aboutReferenceSectionScrollTrigger();
      };
  
  


      
  
      const handleWindowLess830 = () => {

        triggers.push(ScrollTrigger.create({
          trigger: document.window,
          start: "top center",
          pin: ".dynamic-video-player-1 .text-content-mobile-scrollbar",
          pinSpacer:false,
          end: () => welcomeSectionRef.current.offsetTop + welcomeSectionRef.current.clientHeight - windowHeight - 120,
 
        }));

        const aboutReferenceSectionScrollTrigger = () => {
          triggers.push(ScrollTrigger.create({
            trigger: '.dynamic-video-player-5',
            start:`top -${window.innerHeight - document.querySelector('.dynamic-video-player-5 .mask-image-wrap').innerHeight}px`,
            pin: '.dynamic-video-player-5',
            pinSpacer:false,
            end: `+=${window.innerHeight*2}px`,
          }));
        };

        gsap.to('.dynamic-video-player-5 .mask-mouse-area',{
          height: 'calc(100vh - 8vw)',
          scrollTrigger: {
            trigger: '.dynamic-video-player-5',
            start: `top top`, // Adding 4vw to the bottom
            end:()=> '+=100vh',
            scrub: true,
            id: "scrub",
  
          },
        });
  
        gsap.fromTo(".dynamic-video-player-1 .mask-image-wrap", {
          height: 'calc(100vh - 12vw)',
        },{
          height: 'calc(50vh - 10vw)',
          scrollTrigger: {
            trigger: welcomeSectionRef.current, 
            start: 'top top',
            end: '100vh',
            scrub: true,
            id: "scrub",
          },
        });

        gsap.to('.page-three',{
          y:'-100vh',
          scrollTrigger: {
            trigger: welcomeSectionRef.current, 
            start:()=> welcomeSectionRef.current.offsetTop + welcomeSectionRef.current.clientHeight - windowHeight - 120,
            end: () => welcomeSectionRef.current.offsetTop + welcomeSectionRef.current.clientHeight * 1.8 - windowHeight ,
            scrub: true,
            id: "scrub",
          },
        });

        gsap.to(".text-content-mobile-scrollbar-thumb", {
          bottom: "0",
          scrollTrigger: {
            trigger: '.section-two',
            start: "300px top",
            end: () => welcomeSectionRef.current.offsetTop + welcomeSectionRef.current.clientHeight - windowHeight - 120,
            scrub: true,
            id: "scrub",
          },
        });

        aboutReferenceSectionScrollTrigger();
        
      };
  
      sectionOneScrollTrigger();


      
  
  
      // Set up initial animations based on current window width
      if (windowWidth >= 831) {
        handleMinWidth831();
      } else {
        handleWindowLess830();
      }
      
  
      // Cleanup function to kill only local ScrollTrigger instances
      return () => {
        triggers.forEach(trigger => trigger.kill());
      };

    }, [windowWidth, windowHeight, welcomeSectionRef, aboutReferenceSectionRef, section3Ref, pageHeight]);


  useEffect(() => {
    // Function to handle window resize
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }


    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };

    
  }, []);

  let location = useLocation();

    useEffect(() => {
     
        gsap.fromTo(".mask-mouse-area > a", { height:'0px' }, { height: 'auto', duration: 1, ease:[0.76, 0, 0.24, 1], delay:0.2});
        
    }, [location]);

  const animation = () =>{
    if(xPercent <= -360){
        xPercent = 0
    }
    if(xPercent > 0){
        xPercent = -360;
    }
    gsap.set('.inner-inner-asterix', {rotate: `${xPercent}deg`, transformOrigin:'center'})
    xPercent += 0.06 * direction;
    requestAnimationFrame(animation);
  }



 const updatePageHeight = () => {
  if (welcomeSectionRef.current && firstThreeSectionsRef.current) {
    const height = firstThreeSectionsRef.current.offsetHeight;
    setPageHeight(height);
  }
};

useEffect(() => {
  updatePageHeight(); // Initial call to set the height

  const handleResize = () => {
    updatePageHeight();
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

useEffect(() => {
  const handleHeightChange = () => {
    updatePageHeight();
  };

  if (firstThreeSectionsRef.current) {
    firstThreeSectionsRef.current.addEventListener('transitionend', handleHeightChange);
  }

  return () => {
    if (firstThreeSectionsRef.current) {
      firstThreeSectionsRef.current.removeEventListener('transitionend', handleHeightChange);
    }
  };
}, [firstThreeSectionsRef.current]);


useEffect(() => {
  // Function to update page height when firstThreeSectionsRef height changes
  const handleHeightChange = () => {
    updatePageHeight();
  };

  if (firstThreeSectionsRef.current) {
    firstThreeSectionsRef.current.addEventListener('transitionend', handleHeightChange);
  }

  return () => {
    if (firstThreeSectionsRef.current) {
      firstThreeSectionsRef.current.removeEventListener('transitionend', handleHeightChange);
    }
  };
}, [firstThreeSectionsRef.current]);

    return (
        <main className="home" >
      
             
            <section className="page" ref={welcomeSectionRef} style={{ height: pageHeight }}>
         
                 {isSection3Visible && <div className="header-background-gradient" />}

                <div className={`${windowWidth < 830 ? 'small-dynamic-video-player':''} dynamic-video-player dynamic-video-player-1`} ref={imageRef} >
                    <DynamicVideoPlayer index={1} data={projectNavData} hoveredItem={hoveredItem} image="/franco.png" isSection3Visible={isSection3Visible} section={1} windowWidth={windowWidth}/>
                    <div className="text-content-mobile-scrollbar">
                      <div className="text-content-mobile-scrollbar-thumb"></div>
                    </div>
                </div>
                {windowWidth < 830 ? <Section1 windowWidth={windowWidth}/>:<></>}

                <section className="text-content-layer first-three-sections" ref={firstThreeSectionsRef}>  
                    {windowWidth > 830 ? <Section1 windowWidth={windowWidth}/>:<></>}
                    <Section2 title={'Intro'} windowWidth={windowWidth}/>
                    <div className="section-three-wrap" ref={section3Ref}>
                      <Section3 title={'Project list'}  data={projectNavData} onHoverChange={handleHoverChange}/>
                    </div>
                   
                </section>
            </section>
            <Section4 title={'About'}/>
            <div className="about-reference-wrap" ref={aboutReferenceSectionRef}>
              <div className="dynamic-video-player dynamic-video-player-5">
                <DynamicVideoPlayer image={'/Max-About.png'} section={5} index={5}/>
             
              </div>
              <Section5 title={'About'}/>
              <Section6 title={'ReferencePeace'}/>
              <Section7 title={'ReferencePeace-2'}/>
    
            </div>
            <div className="home-contact-wrap">
                <ContactBlock/>
            </div>
      
        </main>
    );
}

const DynamicVideoPlayer = ({ image, isSection3Visible, windowWidth, data, hoveredItem, index }) => {
  const maskRef = useRef(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const initialObjectPosition = "center center";

  const initialStyles = {
    width: "68.5vw",
    height: "100%",
  };

  const handleMouseMove = (event, targetRef) => {
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


      targetRef.current.style.objectPosition = `calc(50% + ${imageX}px) calc(50% + ${imageY}px)`;
    }
  };

  const handleMouseEnter = () => {
    if(videoRef.current){
    videoRef.current.style.transition = "object-position 0.5s ease, min-width 0.5s ease-out 0s, scale 0.3s ease-out"; // Enable transition for smooth hover effect

    }
    imageRef.current.style.transition = "object-position 0.5s ease, min-width 0.5s ease-out 0s, scale 0.3s ease-out"; // Enable transition for smooth hover effect
    setIsHovered(true);
    setTimeout(() => {
      if(videoRef.current){
      videoRef.current.style.transition = "object-position 0s ease, min-width 0.5s ease-out 0s, scale 0.3s ease-out"; // Disable transition for smooth hover effect
      }
      if(imageRef.current){
        imageRef.current.style.transition = "object-position 0s ease, min-width 0.5s ease-out 0s, scale 0.3s ease-out"; // Disable transition for smooth hover effect

      }
    }, 600);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    imageRef.current.style.transition = "object-position 0.5s ease, min-width 0.5s ease-out 0s, scale 0.3s ease-out"; // Apply transition for smooth mouse leave effect
    imageRef.current.style.objectPosition = initialObjectPosition; // Reset object position on mouse leave
  };

  useEffect(() => {
    const mask = maskRef.current;

    const onMouseMove = (event) => handleMouseMove(event, imageRef);
    const onVideoMouseMove = (event) => handleMouseMove(event, videoRef);

    mask.addEventListener("mousemove", onMouseMove);
    mask.addEventListener("mouseenter", handleMouseEnter);
    mask.addEventListener("mouseleave", handleMouseLeave);

    if (videoRef.current) {
      mask.addEventListener("mousemove", onVideoMouseMove);
      mask.addEventListener("mouseenter", handleMouseEnter);
      mask.addEventListener("mouseleave", handleMouseLeave);
    }

    if (isSection3Visible) {
      maskRef.current.style.transition = 'none';
    }

    return () => {
      mask.removeEventListener("mousemove", onMouseMove);
      mask.removeEventListener("mouseenter", handleMouseEnter);
      mask.removeEventListener("mouseleave", handleMouseLeave);

      if (videoRef.current) {
        mask.removeEventListener("mousemove", onVideoMouseMove);
        mask.removeEventListener("mouseenter", handleMouseEnter);
        mask.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isHovered, initialObjectPosition, isSection3Visible]);

  const determineImage = () => {
    if (hoveredItem) {
      return hoveredItem.imageLink;
    } else if (data && data.length > 0) {
      return data[0].imageLink;
    }
    return ''; // Default image link if no data available
  };

  useEffect(() => {
    const imageSrc = determineImage();
    if (imageSrc && imageRef.current) {
      imageRef.current.src = imageSrc;
    }
  }, [isHovered, hoveredItem, data]);

  let scrollTriggerInstance = null;

// Custom throttle function
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};


useEffect(() => {
  const videoElement = videoRef.current;

  if (videoElement) {
    const handleLoadedMetadata = () => {
      videoElement.currentTime = 0;

      // Throttled function to update video time
      const updateVideoTime = throttle((self) => {
        const duration = videoElement.duration;
        const targetTime = duration * self.progress;
        if (targetTime >= 0 && targetTime <= duration) {
          videoElement.currentTime = targetTime;
        }
      }, 100); // Throttle time in milliseconds

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: ".first-three-sections",
        start: "top top",
        scrub: false,
        onUpdate: (self) => updateVideoTime(self),
      });
    };

    // Add event listener for loadedmetadata
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('resize', handleLoadedMetadata);

    // Clean up event listener on component unmount
    return () => {
      videoElement.removeEventListener('resize', handleLoadedMetadata);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }
    };
  }
}, [videoRef]);


  // Linear interpolation function
  function lerp(a, b, t) {
    return a * (1 - t) + b * t;
  }

  return (
    <div className={`mask-mouse-area area-${index}`}>
      <DelayLink
        to={`${hoveredItem ? `/projects/${hoveredItem.displayName}` : (data && data.length > 0 ? data[0].link : '')}`} // Specify the destination link here
        delay={2000} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
        onDelayStart={handleDelayStart} // Callback when delay starts
        onDelayEnd={handleDelayEnd} // Callback when delay ends and navigation happens
      >
        <div className="mask-image-wrap" ref={maskRef}>
          <div>
            {index === 1 &&
            <video
              className="scroll-video"
              ref={videoRef}
              id="v0"
              preload="preload"
              muted
            >
              <source src="/test-scroll.mp4" type="video/mp4" />
            </video>
          }
          <div className="reference-peace-bg-gradient"></div>
          {image ? (
            <img
              className="mask-image"
              src={image}
              style={initialStyles}
              ref={imageRef}
              alt="Franco"
            />
          ) : (
            <img
              className="mask-image"
              src={determineImage()}
              style={initialStyles}
              ref={imageRef}
              alt="Franco"
            />
          )}
         
          </div>
          <div className="details">
            <div className="player-project-name">
              {hoveredItem ? ( // Check if an item is hovered
                <div>
                  <p className="artist-name">
                    <span className="artist-name-span">{hoveredItem.displayName}</span>
                  </p>
                  <p>
                    <span>{hoveredItem.videoName}</span>
                  </p>
                  <p className="home-details-cta">
                    <span className="details-button">Full Project</span>
                  </p>
                </div>
              ) : (
                data && data.length > 0 ? ( // Check if there's data available
                  <div>
                    <p className="artist-name">
                      <span className="artist-name-span">{data[0].textContent}</span>
                    </p>
                    <p>
                      <span>{data[0].projectName}</span>
                    </p>
                    <p>
                      <span className="details-button">Full Project</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Render a default message or placeholder content when no data is available */}
                    {index == 5 ?
                     <a className="primary-button insta-button">Instagram</a>
                    :
                      <p>No data available</p>


                    }

                  </div>
                )
              )}
            </div>
          </div>
          <div className="body scroll-notification">
            <p onClick={() => scrollToPercentageOfViewportHeight(85)}>
              (<span>SCROLL</span>)
            </p>
          </div>
        </div>
      </DelayLink>
    </div>
  );
};  


const Section1 = () =>{





  return(
        <div className="page-one">
            <div className="main-heading-wrap high-z-index-layer">
            <div className="main-heading-wrap-inner">
                <h1 className="heading max-title">AX DONA</h1>
                <h3 className="body max-subtitle">Visual Direction & <br/> Cinematography</h3>
              
            </div>
            
            </div>
           
            <div className="see-my-work high-z-index-layer">              
            <p className="body">
                NAVIGATING AN UN-
                INTERRUPTED STREAM OF
                MODERN CREATIVITY, BY
                DOCUMENTING A CURATED
                LINEUP OF ARTISTS &
                PROLIFICS.
              </p>
              <DelayLink
               to={`/films`} // Specify the destination link here
               delay={1500} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
               onDelayStart={handleDelayStart} // Callback when delay starts
               onDelayEnd={handleDelayEnd} // Callback when delay ends and navigation happens
              >
                <button className=" primary-button button-gradient">Full Archive</button>
              </DelayLink>
            </div>

        </div>
  )
}



const Section2 = ({windowWidth}) => {

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
      const { offsetTop, clientHeight } = sectionRef.current;
      const sectionHeight = clientHeight;
      const scrollPosition = window.scrollY + window.innerHeight;
      const triggerPoint = offsetTop + sectionHeight * 1.15;
  
      const isTriggered = scrollPosition >= triggerPoint;
  
      setIsVisible(isTriggered);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call it initially to set the initial state
  
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  return(
     <div className={`page-two ${isVisible ? "visible" : ""}`} ref={sectionRef}>
            <div className="page-two-row-one high-z-index-layer">
            <span className="body">
                <Reveal custom={1} textContent={'DETAILING SHOTS & SCENES'} element={"div"}/>

            </span>
            </div>
            <div className="page-two-row-two high-z-index-layer">
                <Reveal custom={2} textContent={'& Based In'} element={"span"} elementClass={"body born-in"}/>
                <span className="title max-location">
                    <Reveal textContent={'Sydney,'} element={"div"} elementClass={'title'}/>
                    <Reveal textContent={'Australia.'} element={"div"} elementClass={'title'}/>
                </span>
            </div>
            <div className="page-two-row-three high-z-index-layer">
                <span className="body">
                    <Reveal custom={2} textContent={'I’M DRIVEN BY SHARING AND  VISUALISING COLLABORATIVE IDEAS THROUGH THE LENSE OF LOCAL & INTERNATIONAL PROJECTS.'} element={"div"}/>
                  </span>
                  <span className="my-work-cta">
                     <Reveal custom={2} variant={'opacity'} textContent={'My work'} element={'button'} elementClass={"primary-button button-gradient"} onClick={()=>scrollToPercentageOfViewportHeight(190)} />
                  </span>
            </div>
        </div>
  )
};

const Section3 = ({ onHoverChange }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const { x, y, isOutside } = useMousePosition(".App");
  const [hoverDescHeight, setHoverDescHeight] = useState(0);
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const [currentProject, setCurrentProject] = useState(''); // Initialize with first item's focusGenre
  const [wobble, setWobble] = useState({ translateY: 0, rotate: 0 }); // State for wobble effect
  const hoverDescRef = useRef(null);
  const wobbleTimeoutRef = useRef(null); // Ref to store the timeout
  const [projectColour, setProjectColour] = useState(0);

  const featuredProjects = useRealtimeFeaturedProjects();
  const [prevHover, setPrevHover] = useState([featuredProjects[0]]);



useEffect(() => {
const handleScroll = () => {
  if (sectionRef.current) {
    const { offsetTop, clientHeight } = sectionRef.current;
    const sectionHeight = clientHeight;
    const scrollPosition = window.scrollY + window.innerHeight;
    const triggerPoint = offsetTop + sectionHeight * 0.80;

    const isTriggered = scrollPosition >= triggerPoint;

    setIsVisible(isTriggered);
  }
};


    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call it initially to set the initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handleMouseLeave = () => {

    gsap.to('.home-hover-desc .link-desc > span', {
    y:'100%',
    duration:0.2,
  
  });
  }

  const handleMouseEnter = (item) => {
    // Update prevHover and trigger onHoverChange if different item
    if (prevHover && prevHover.id === item.id) {
      setPrevHover(item);
    } else {
      setPrevHover(item);
      onHoverChange(item);
    }

    // Set projectColor based on the new data structure
    setProjectColour(item.projectColor);

    gsap.to('.home-hover-desc .link-desc > span', {
      y: '100%',
      duration: 0.3,
      onComplete: () => {
        setCurrentProject(item.focusGenre);
        gsap.to('.home-hover-desc .link-desc > span', {
          y: '100%',
          color: item.projectColor,
          opacity: 0,
          duration: 0,
          onComplete: () => {
            gsap.to('.home-hover-desc .link-desc > span', {
              y: '0%',
              opacity: 1,
              duration: 0.3,
              delay: 0.3,
            });
          },
        });
      },
    });
  };
  


  useEffect(() => {

      const calculateVelocity = () => {
        const vx = x - prevX;
        const vy = y - prevY;
        setVelocity({ vx, vy });
        setPrevX(x);
        setPrevY(y);
      };

      calculateVelocity();




  }, [x, y]);

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const maxTranslation = 3; 
  const maxRotation = 1.5; 

  
  useEffect(() => {
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


  }, [velocity]);





  useEffect(()=>{
    gsap.to('.home-hover-desc', {
    width:document.querySelector('.home-hover-desc .link-desc > span').clientWidth,
    duration:0,
    });
    gsap.to('.home-hover-desc', {
    height:document.querySelector('.home-hover-desc .link-desc > span').clientHeight,
    duration:1,
    });
  }, [currentProject]);

  
  return (
    <section className={`page-three-wrap`} ref={sectionRef}>
      
      <div
        className={`home-hover-desc`}
        ref={hoverDescRef}
        style={{
          position: "fixed",
          left: `${x - 14}px`,
          top: `${y - hoverDescHeight / 2}px`,
          transform: `translateY(${wobble.translateY}px) rotate(${wobble.rotate}deg)`,
        }}
      >
        <div className="home-hover-svg-wrap">
          <svg width="17" height="25" viewBox="0 0 17 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="home-hover-arrow">
          <path style={{ fill: `${projectColour}` }} fill-rule="evenodd" clip-rule="evenodd" d="M2.0078 4.99998H0.29C0.193334 4.99998 0 4.95453 0 4.77271V0.22727C0 0 0.348 0 0.580001 0H1.74023H6.38H6.38086H8.12023H11.2382H12.1809H16.2405V4.63965V6.37983V10.4395V10.4473H16.2435V16.2471C16.2435 16.4791 16.2435 16.8271 16.0053 16.8271H11.2411C11.0506 16.8271 11.0029 16.6338 11.0029 16.5371V10.7739C11.0009 10.7578 11 10.7427 11 10.7295V8.99603L6.39529 13.6006L6.39552 13.6008L3.92365 16.0726C3.82477 16.1715 3.67646 16.3198 3.50954 16.1529L0.171188 12.8146C0.037654 12.6811 0.0866662 12.5653 0.127864 12.5241L1.48753 11.1645L1.4873 11.1642L7.65128 5.00047H2.03023C2.02257 5.00047 2.01509 5.0003 2.0078 4.99998Z" fill="#181818"/>
          </svg>
        </div>
        
        <p className={`body link-desc`}>
          <span dangerouslySetInnerHTML={{ __html: currentProject }}></span>
        </p>
      </div>
      <div className="high-z-index-layer">
        <Reveal variant={'opacity'} textContent='FEATURED WORK ( 2023 / 2022 )' element='p' elementClass="body" />
      </div>
      <div className={`page-three ${isVisible ? "visible" : ""}`}>
        <span className="heading home-project-list"  onMouseLeave={()=>handleMouseLeave()}>
        {featuredProjects.length > 0 ? (
            featuredProjects.map((project) => (
              <div key={project.id} className={`title ${prevHover && prevHover.id === project.id ? "prev-hover" : ""}`}  onMouseEnter={() => handleMouseEnter(project)}>
                <div className="project-color" style={{ backgroundColor: `${projectColour}` }}></div>
                <DelayLink 
                  to={`projects/${project.displayName}`}
                  delay={2000} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
                  onDelayStart={()=>handleDelayStart(project.projectColor)} // Callback when delay starts
                  onDelayEnd={handleDelayEnd} // Callback when delay ends and navigation happens

                >
                  <Reveal
                    key={project.id}
                    custom={project.id}
                    textContent={project.displayName}
                    element="div"
                    elementClass={`title featured-project-link`}
                  />
                </DelayLink>
              </div>
            ))
          ) : (
            <p>No featured projects available.</p>
          )}
          {/* {data.map((item) => (
            <div
              key={item.id}
              className={`title ${prevHover && prevHover.id === item.id ? "prev-hover" : ""}`}
              onMouseEnter={() => handleMouseEnter(item)}
              
              
            >
              <div className="project-color" style={{ backgroundColor: `${projectColour}` }}></div>
              <DelayLink 
                to={item.link}
                delay={2000} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
                onDelayStart={handleDelayStart} // Callback when delay starts
                onDelayEnd={handleDelayEnd} // Callback when delay ends and navigation happens
               
              >
                <Reveal
                  key={item.id}
                  custom={item.id}
                  textContent={item.textContent}
                  element="div"
                  elementClass={`title featured-project-link`}
                />
              </DelayLink>
            </div>
          ))} */}
        </span>
      </div>
      <button className="primary-button high-z-index-layer button-gradient">Full Archive</button>
    </section>
  );
};




const Section4 = () => {
  const [mouseY, setMouseY] = useState(0);
  const [toggle, setToggle] = useState(false);
  const containerRef = useRef(null);
  const imageWrapRef = useRef(null);

  const handleMouseMove = (event) => {
    if (containerRef.current && imageWrapRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseRelativeY = event.clientY - containerRect.top;
      setMouseY(mouseRelativeY);
    }
  };

  const toggleService = () => {
    if(toggle){
      setToggle(false);
      gsap.to('',{
        
      })
    }else{
      setToggle(true)
    }
  }

const serviceImageAnimation = (i) => () => {
  gsap.to('.page-four-service-image', {
    y: `-${((window.innerWidth * 0.11) * (i - 1)) + (i - 1) * 20}px`,
  });
};
    

  useEffect(() => {
    if (containerRef.current && imageWrapRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const imageWrapHeight = imageWrapRef.current.clientHeight;

      // Calculate the top position ensuring it stays within the bounds
      let topPosition = mouseY - imageWrapHeight / 2;
      if (topPosition < 0) topPosition = 0;
      if (topPosition + imageWrapHeight > containerHeight) topPosition = containerHeight - imageWrapHeight;

      imageWrapRef.current.style.top = `${topPosition}px`;
    }
  }, [mouseY]);

  return (
    <div className="page-four">
      <div className="page-four-top-wrap high-z-index-layer">
        <div>
          <p className="title-body">What I Do:</p>
        </div>
        <div className="page-four-top-wrap-desc">
          <p className="body">Covering various visual disciplines</p>
          <p className="body">Working with the inspired to produce the inspiring</p>
        </div>
        <div>
          <p className="primary-button what-i-do-cta button-gradient insta-button">Instagram</p>
        </div>
      </div>
      <div
        className={`page-four-middle-wrap ${toggle ? 'service-toggle-desc' : 'service-toggle-image'}`}
        onMouseMove={handleMouseMove}
        onClick={toggleService}
        style={{ position: 'relative'}} // Ensure the height is set correctly
        ref={containerRef}
      >
        <div
          className="page-four-service-image-wrap"
          ref={imageWrapRef}
          style={{
            position: 'absolute',
            right: 0,
          }}
        >
          <div className="page-four-service-image"></div>
          <div className="page-four-service-image"></div>
          <div className="page-four-service-image"></div>
        </div>
        <div className="page-four-service-one page-four-service" onMouseEnter={serviceImageAnimation(1)}>
          <Reveal custom={1} textContent={'Art Direction'} element={"div"} elementClass={"title"} />
          <div className="service-desc">
            <p className="body">
              DEFINING STRONG CONCEPTUAL NARRATIVES BY NAVIGATING THE NUANCES OF A CLIENT’S REQUIREMENTS.
            </p>
          </div>
        </div>
        <div className="page-four-service-two page-four-service" onMouseEnter={serviceImageAnimation(2)}>
          <Reveal custom={2} textContent={'Collaboration'} element={"div"} elementClass={"title"} />
          <div className="service-desc">
            <p className="body">
              SEEING EYE TO EYE WITH CREATIVES & PRODUCING VISUALS TO MATCH THEIR VISION.
            </p>
          </div>
        </div>
        <div className="page-four-service-three page-four-service" onMouseEnter={serviceImageAnimation(3)}>
          <Reveal custom={3} textContent={'Production'} element={"div"} elementClass={"title"} />
          <div className="service-desc">
            <p className="body">
              END TO END EXECUTION
              WITH THE SAME LEVEL OF INTENTION THROUGHOUT,<br />
              FROM PRE <span>&#8594;</span> POST PRODUCTION.
            </p>
          </div>
        </div>
      </div>
      <div className="page-four-bottom-wrap high-z-index-layer">
        <DelayLink
          to={`/contact`} // Specify the destination link here
          delay={1500} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
          onDelayStart={handleDelayStart} // Callback when delay starts
          onDelayEnd={handleDelayEnd} // Callback when delay ends and navigation happens
        >
          <div className="primary-button button-gradient">Let's work</div>
        </DelayLink>
      </div>
      <div className="page-four-dynamic-wrap">
        <div className="dynamic-video-player dynamic-video-player-4">
          <DynamicVideoPlayer image={'/domengo.png'} section={4} index={4} />
        </div>
        <div className="dynamic-video-player dynamic-video-player-4 middle">
          <DynamicVideoPlayer image={'/esoteric.webp'} section={4} index={4} />
        </div>
      </div>
    </div>
  );
};

const Section5 = () =>{
  const section5Ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.9, // Trigger when 50% of the element is in the viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
    }, options);

    if (section5Ref.current) {
      observer.observe(section5Ref.current);
    }

    return () => {
      if (section5Ref.current) {
        observer.unobserve(section5Ref.current);
      }
    };
  }, []);

  return(

    <div className={`page-five high-z-index-layer ${isVisible ? "visible" : ""}`} ref={section5Ref} >

      <div className="page-five-left">


      </div>
      <div className="page-five-right ">
        <div>
        <Reveal textContent={'Vision'} element={"h2"} elementClass={"heading"}/>
        <Reveal textContent={'To Vision'} element={"h2"} elementClass={"heading"}/>
        </div>
       
        <div className="home-about-desc">
          <Reveal textContent={'TRANSLATING CREATIVES IMAGINATION TO A STRUCTURED & INTENTIONAL APPROACH,'} custom={2} element={"p"} elementClass={"body"}/>
          <Reveal textContent={' BY EXPLORING & UNDERSTANDING THE PASSION OF PEERS. EXPRESSING THEIR OUTER-VIDUALISM*'} custom={2.5} element={"p"} elementClass={"body"}/>
        </div>
        <DelayLink
        to={`/about`} 
        delay={1500} 
        onDelayStart={handleDelayStart} 
        onDelayEnd={handleDelayEnd} 
        >
          <Reveal variant={'opacity'} textContent={"Get to know me"} element={'p'} elementClass={"primary-button button-gradient"}/>

        </DelayLink>
        </div>
    </div>
  )
}

const Section6 = () => {
  const section6Ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.05, // Trigger when 50% of the element is in the viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      });
    }, options);

    if (section6Ref.current) {
      observer.observe(section6Ref.current);
    }

    return () => {
      if (section6Ref.current) {
        observer.unobserve(section6Ref.current);
      }
    };
  }, []);

  return (
    <div className={`page-six ${isVisible ? "visible" : ""}`} ref={section6Ref}>
      <div className="home-reference-top home-reference-row">
        <Reveal variant={'opacity'} textContent={"I'M CURRENTLY FORMULATING.."} element={'div'} elementClass={"body"}/>

        <Reveal textContent={'A VISUAL ARTS'} element={"div"} elementClass={"heading"}/>
        <Reveal textContent={'MAGAZINE BY YOUNG'} element={"div"} elementClass={"heading"}/>
        <Reveal textContent={'CREATORS:'} element={"div"} elementClass={"heading"}/>
      </div>
      <div className="home-reference-center home-reference-row">
        <SvgComponent/>
      </div>
      <div className="home-reference-bottom home-reference-row">
        <div className="home-reference-bottom-left home-reference-bottom-column">
          <Reveal textContent={'PLATFORMING'} element={"div"} elementClass={"heading"}/>
          <Reveal textContent={'ONE ANOTHER'} element={"div"} elementClass={"heading"}/>
          <Reveal textContent={'THROUGH'} element={"div"} elementClass={"heading"}/>
          <Reveal textContent={'CREATIVE'} element={"div"} elementClass={"heading"}/>
          <Reveal textContent={'PURSUITS.'} element={"div"} elementClass={"heading"}/>
        </div>
        <div className="home-reference-bottom-right home-reference-bottom-column">
          <p className="body">
             REFERENCE PEACE AIMS TO BRIDGE THE GAP BETWEEN IMPRESSION & EXPRESSION; BY PUTTING A SPOTLIGHT ON UN-SPOTLIGHTED*
          </p>
          <div className="primary-button">
            Read More
          </div>
        </div>
      </div>
    
    </div>
  );
};

const Section7 = () => {
 

  return (
    <div className={`page-seven`}>
      <div>
        
      </div>
    </div>
  );
};


const scrollToPercentageOfViewportHeight = (percentage) => {
    const vh = window.innerHeight * (percentage / 100);
    window.scrollTo({
      top: vh,
      behavior: 'smooth'  // Add smooth scrolling behavior
    });
  };

  const handleDelayStart = (color) => {
    gsap.to(".mask-mouse-area", { alignItems:'start', duration: 0});
    gsap.to(".body", { opacity: '0', duration: 0.2, ease:[0.76, 0, 0.24, 1]});
    gsap.to(".details", { opacity: '0', duration: 0.2, ease:[0.76, 0, 0.24, 1]});
    gsap.to(".mask-mouse-area > a", { height: '20', duration: 1.2, delay:0.2, ease:[0.76, 0, 0.24, 1]});

    if (color) {
      document.documentElement.style.setProperty('--secondary-dark', color);
    }

  };

  const handleDelayEnd = (e, to) => {
    // You can perform actions when the delay ends and navigation happens, if needed
    console.log(`Delay ended for link to ${to}`);
  };

export default Home;
