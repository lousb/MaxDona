import React, { useRef, useLayoutEffect, useState, useEffect, forwardRef } from "react";
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
    const section6Ref = useRef(null);
    const welcomeSectionRef = useRef(null);
    const aboutReferenceSectionRef = useRef(null);
   
     const [pageHeight, setPageHeight] = useState(0);
 const firstThreeSectionsRef = useRef(null);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    let xPercent = 0;
    let direction = -1;
    const featuredProjects = useRealtimeFeaturedProjects();
    const [prevHover, setPrevHover] = useState([featuredProjects[0]]);
    const [projectColour, setProjectColour] = useState(0);

    const section3Ref = useRef(null);
    const [isSection3Visible, setIsSection3Visible] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    


    const [hoveredItem, setHoveredItem] = useState(null);

    // Reset hoveredItem when section 3 is not visible
    useEffect(() => {
      if (!isSection3Visible) {
        handleHoverChange(null);
        setPrevHover(null);
      } else if (featuredProjects && featuredProjects[0]) { 
        setPrevHover(featuredProjects[0]);
        handleHoverChange(featuredProjects[0]);

        if (featuredProjects[0].projectColor) {
          setProjectColour(featuredProjects[0].projectColor);
        }
      }
    }, [isSection3Visible, featuredProjects]);
    

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
      let mm = gsap.matchMedia();


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



      mm.add("(min-width: 831px)", () => {
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
  
        gsap.fromTo(".dynamic-video-player-1 .mask-image, .dynamic-video-player-1 .mask-image-blurhash-wrap", { width:'calc(68.5vw)'}, {
          width: "45.3vw",
          scrollTrigger: {
            start: "top top",
            end:()=> `+=${windowHeight}`,
            scrub: 2,
            id: "scrub",
            trigger: welcomeSectionRef.current,
          },
        });
  
        gsap.fromTo(".dynamic-video-player-1 .mask-image-wrap, .dynamic-video-player-1 .mask-mouse-area", {
          height: 'calc(100vh - 4vw - 164px)',
          maxHeight:'calc(100vh - 4vw - 164px)',
  
        },{
          height: 'calc(100vh - 4vw - 84px)',
          maxHeight:'calc(100vh - 4vw - 84px)',
          scrollTrigger: {
            trigger: welcomeSectionRef.current, 
            start: 'top top',
            end:()=> `+=${windowHeight}`,
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

        gsap.to(".mask-image, .scroll-video, .mask-image-blurhash-wrap", {
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
      });
  
  


      
  
      mm.add("(max-width: 830px)", () => {

        // triggers.push(ScrollTrigger.create({
        //   trigger: '.first-two-sections',
        //   start: "top top",
        //   pin: ".dynamic-video-player-1 .text-content-mobile-scrollbar",
        //   pinSpacer:false,
        //   end: `bottom bottom`,
 
        // }));

        // triggers.push(ScrollTrigger.create({
        //   trigger: '.about-reference-wrap',
        //   start: `-=${windowHeight} top`,
        //   pin: ".page-five-right > div",
        //   pinSpacer:false,
        //   end:()=> `+=${windowWidth * 5}`,
        //   markers: true,
        //   scrub: true,

        // }));
        

     let initialHeight = windowWidth * 0.88;

        

        const aboutReferenceSectionScrollTrigger = () => {
          triggers.push(ScrollTrigger.create({
            trigger: '.dynamic-video-player-5',
            start:()=> `bottom bottom`,
            pin: '.dynamic-video-player-5',
            pinSpacer:false,
            end: `+=${section6Ref.current.offsetHeight - (windowWidth * 3.6) + (windowWidth * 0.9)}px`,

           onUpdate: (self) => {
             if (initialHeight === null) return;  // Ensure the initialHeight is set

             // Calculate the scroll distance from the start of the trigger
             const scrollDistance = Math.max(0, self.scroll() - self.start);  // Clamp the value to avoid negative heights

             // Calculate the maximum height allowed
             const maxHeight = window.innerHeight - window.innerWidth * 0.16;

             // Calculate the new height, ensuring it stays within the initialHeight to maxHeight range
             const newHeight = Math.min(initialHeight + scrollDistance, maxHeight);

             // Debugging: log the height to ensure it's calculated
             console.log('New Height:', newHeight);

             // Apply the calculated height to the .mask-mouse-area element
             gsap.set('.dynamic-video-player-5 .mask-mouse-area, .dynamic-video-player-5 .mask-mouse-area > a, .dynamic-video-player-5 .mask-mouse-area > a > div, .dynamic-video-player-5 .mask-mouse-area .mask-image', {
               minHeight: `${newHeight}px`,  // Set the dynamic height
             });
           },
          }));
        };
  
        gsap.fromTo(".dynamic-video-player-1 .mask-image-wrap", {
          maxHeight:'calc(100vh - 12vw)',
        },{
          maxHeight:'calc(50vh - 10vw)',
          scrollTrigger: {
            trigger: welcomeSectionRef.current, 
            start: 'top top',
            end: '100vh',
            scrub: 2,
            id: "scrub",
          },
        });
        gsap.to(".reference-peace-bg-gradient", {
          y: "-50%",
          opacity:1,
          scrollTrigger: {
            trigger: '.page-six',
            start: `${windowWidth * 3.6} bottom`,
            end:()=> "+=200px",
            scrub: true,
            id: "scrub",
          },
        });

        if(welcomeSectionRef.current){
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
        }
    

        gsap.to(".mask-image, .scroll-video, .mask-image-blurhash-wrap", {
          '-webkit-filter':'blur(10px)',
          filter: 'blur(10px)',
          scrollTrigger: {
            trigger: '.page-six',
            start: `${windowWidth * 3.6} bottom`,
            end:()=>'+=100px',
            scrub: 2,
            id: "scrub",
          },

        });

        

        aboutReferenceSectionScrollTrigger();
        
      });
  
      sectionOneScrollTrigger();


      
  
  
      
      
  
      // Cleanup function to kill only local ScrollTrigger instances
      return () => {
        triggers.forEach(trigger => trigger.kill());
        ScrollTrigger.clearMatchMedia(); // Cleanup on window size change
      };
      
    }, [windowWidth, windowHeight, welcomeSectionRef, aboutReferenceSectionRef, section3Ref, pageHeight, isSection3Visible]);


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
    if (window.innerWidth <= 830) {
      setPageHeight(height + windowHeight); 
    } else {
      setPageHeight(height);
    }
  }
};

useEffect(() => {
  updatePageHeight();

  const handleResize = () => {
    updatePageHeight();
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize); // For mobile devices

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
}, []);



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
}, [firstThreeSectionsRef.current, windowWidth]);

useEffect(() => {
  const ref = section3Ref.current;

  if (!ref) return; // Exit early if the ref is not yet assigned

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && window.scrollY < ref.offsetTop) {
        setIsSection3Visible(true);
      } else if (!entry.isIntersecting && window.scrollY < ref.offsetTop) {
        setIsSection3Visible(false);
      }
    },
    { threshold: 0.03 } // Adjust the threshold as needed
  );

  observer.observe(ref);

  return () => {
    if (ref) {
      observer.unobserve(ref);
    }
  };
}, [section3Ref.current]); // Dependency array






    return (
        <main className="home" >
      
             
            <section className="page" ref={welcomeSectionRef} style={{ height: pageHeight }}>
        
                <div className={`${windowWidth < 830 ? 'small-dynamic-video-player':''} dynamic-video-player dynamic-video-player-1`} ref={imageRef} >
                    <DynamicVideoPlayer index={1} data={projectNavData} hoveredItem={hoveredItem} image="/franco.png" isSection3Visible={isSection3Visible} section={1} windowWidth={windowWidth}/>
                    
                </div>
                {windowWidth < 830 ? <Section1 windowWidth={windowWidth}/>:<></>}

                <section className="text-content-layer first-three-sections" ref={firstThreeSectionsRef}>  
                <div className="first-two-sections">
                  {windowWidth > 830 ? <Section1 windowWidth={windowWidth}/>:<></>}
                  <Section2 title={'Intro'} windowWidth={windowWidth}/>
                </div>
                    
                    <div className="section-three-wrap" ref={section3Ref}>
                      <Section3 title={'Project list'}  data={projectNavData} onHoverChange={handleHoverChange} featuredProjects={featuredProjects} prevHover={prevHover} setPrevHover={setPrevHover} projectColour={projectColour} setProjectColour={setProjectColour}/>
                    </div>
                   
                </section>
            </section>
            <Section4 windowWidth={windowWidth}/>
            <div className="about-reference-wrap" ref={aboutReferenceSectionRef}>
              <div className="dynamic-video-player dynamic-video-player-5">
                <DynamicVideoPlayer image={'/animated_webp/visiontovision3.webp'} section={5} index={5}/>
             
              </div>
              <Section5 title={'About'}/>
              <Section6 ref={section6Ref}/>
    
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
  const blurhashImageRef = useRef(null);
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const initialObjectPosition = "center center";
  const [progress, setProgress] = useState(100);


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

      if(blurhashImageRef.current){
        blurhashImageRef.current.style.backgroundPosition = `calc(50% + ${imageX}px) calc(50% + ${imageY}px)`;

      }


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
        trigger: ".first-two-sections",
        start: "30px top",
        end:`bottom+=60px bottom`,
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

  useEffect(()=>{
    console.log(index + hoveredItem)
  }, [hoveredItem])



const calculateMinHeight = () => {
  return 100 - window.innerWidth * 0.04; // 100px - 4vw in pixels
};

const calculateMaxHeight = () => {
  const vwInPixels = window.innerWidth * 0.88; // 88vw in pixels
  const vhInPixels = window.innerHeight * 0.5 - window.innerWidth * 0.1; // 50vh - 10vw equivalent in pixels
  return Math.min(vwInPixels, vhInPixels); // Choose the smaller of the two
};

const [maskHeight, setMaskHeight] = useState(() => {
  const minHeight = calculateMinHeight();
  const maxHeight = calculateMaxHeight();
  return minHeight + ((maxHeight - minHeight) * 100) / 100;
});

const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Easing function

const [prevValue, setPrevValue] = useState(100); // Track previous value
const [isAnimating, setIsAnimating] = useState(false); // Flag to prevent multiple animations
const [isDragging, setIsDragging] = useState(false);

// Function to handle the actual slider movement
const handleSlide = (e) => {
  const sliderValue = parseFloat(e.target.value);
  const minHeight = calculateMinHeight();
  const maxHeight = calculateMaxHeight();

  // Calculate new height for normal sliding
  const newHeight = minHeight + ((maxHeight - minHeight) * sliderValue) / 100;
  setMaskHeight(newHeight);
  gsap.to(maskRef,{
    height:maskHeight
  })
  setProgress(sliderValue.toFixed(2)); // Update slider progress live
};

// Function to handle easing after dragging stops
const handleSlideEnd = (e) => {
  const sliderValue = parseFloat(e.target.value);
  const minHeight = calculateMinHeight();
  const maxHeight = calculateMaxHeight();

  // Prevent multiple animations
  if (isAnimating) return;

  // If just crossed above 20% from below, ease to 100%
  if (prevValue < 2 && sliderValue > 2) {
    setIsAnimating(true); // Prevent further interactions
    gsap.to({ value: sliderValue }, {
      value: 100,
      duration: 1,
      ease: "power3.inOut",
      onUpdate: function () {
        const progressPercentage = this.targets()[0].value;
        const newHeight = minHeight + ((maxHeight - minHeight) * progressPercentage) / 100;
        setMaskHeight(newHeight);
        setProgress(progressPercentage.toFixed(2));
      },
      onComplete: () => {
        setPrevValue(100);
        setIsAnimating(false);
      },
    });
  } 
  // If just crossed below 80% from above, ease to 1%
  else if (prevValue > 99 && sliderValue < 99) {
    setIsAnimating(true);
    gsap.to({ value: sliderValue }, {
      value: 1,
      duration: 1,
      ease: "power3.inOut",
      onUpdate: function () {
        const progressPercentage = this.targets()[0].value;
        const newHeight = minHeight + ((maxHeight - minHeight) * progressPercentage) / 100;
        setMaskHeight(newHeight);
        setProgress(progressPercentage.toFixed(2));
      },
      onComplete: () => {
        setPrevValue(1);
        setIsAnimating(false);
      },
    });
  }

  setPrevValue(sliderValue); // Track the current value
  setIsDragging(false); // Reset dragging state
};




// Example useEffect to recalculate minHeight and maxHeight if window resizes
useEffect(() => {
  const handleResize = () => {
    const minHeight = calculateMinHeight();
    const maxHeight = calculateMaxHeight();
    setMaskHeight(minHeight + ((maxHeight - minHeight) * 100) / 100);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);
  
  
  


  return (
    <div className={`mask-mouse-area area-${index} ${windowWidth < 830 && index === 1 && progress <= 79 ? 'reduced-height':''}`} style={ windowWidth < 830 ? {height: `${maskHeight}px`} : {}}>
      
      <DelayLink
        to={`${hoveredItem ? `/projects/${hoveredItem.displayName}` : (data && data.length > 0 ? data[0].link : '')}`} // Specify the destination link here
        delay={2000} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
        onDelayStart={handleDelayStart} // Callback when delay starts
        onDelayEnd={handleDelayEnd} // Callback when delay ends and navigation happens
        style={ windowWidth < 830 && index === 1 ? {height: `${maskHeight}px`} : {}}
      >
        <div className="mask-image-wrap" style={ windowWidth < 830 && index === 1 ? {height: `${maskHeight}px`, maxHeight: `${maskHeight}px`} : {}} ref={maskRef} >
          <div>
            {index === 1 &&
            <video
              className="scroll-video"
              ref={videoRef}
              style={ windowWidth < 830 && index === 1 ? {height: `${maskHeight}px`} : {}}
              id="v0"
              preload="preload"
              muted
              
            >
              <source src="/scroll.mp4" type="video/mp4" />
            </video>
          }
          <div className="reference-peace-bg-gradient"></div>
          <img
              className="mask-image"
              src={image}
              style={{...initialStyles, ...windowWidth < 830 && index === 1 ? {height: `${maskHeight}px`} : {}}}
              ref={imageRef}
              alt="Franco"
              loading="lazy"
            />
          {hoveredItem && 
            <div className="mask-image-blurhash-wrap" 
                 style={{ backgroundImage: `url(${hoveredItem.mainFeaturedImage?.blurhash})` }}>
              <div
                className={`mask-image ${hoveredItem.mainFeaturedImage ? 'mask-image-hover-opacity-visible' : 'mask-image-hover-opacity-hidden'}`}
                
                style={{...initialStyles, ...windowWidth < 830 && index === 1 ? {height: `${maskHeight}px`} : {}, backgroundImage: `url(${hoveredItem.mainFeaturedImage?.url})`}}
                ref={blurhashImageRef}
                alt="Hovered Image"
                onLoad={() => {
                  blurhashImageRef.current.classList.add('mask-image-hover-opacity-visible'); // Make the main image fully visible with !important
                  blurhashImageRef.current.classList.remove('mask-image-hover-opacity-hidden');
                }}
                onError={() => {
                  blurhashImageRef.current.classList.add('mask-image-hover-opacity-hidden'); // Hide the main image if it fails to load with !important
                  blurhashImageRef.current.classList.remove('mask-image-hover-opacity-visible');
                }}
              ></div>
            </div>

          }
         
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
      {windowWidth < 830 && index === 1 && (
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onInput={handleSlide} // Update height in real time
          onMouseUp={handleSlideEnd} // Handle easing after user stops dragging
          onTouchEnd={handleSlideEnd} // Handle easing for touch events
          onMouseDown={() => setIsDragging(true)} // Mark the start of dragging
          onTouchStart={() => setIsDragging(true)} // Mark the start of touch dragging
          className="slider-vertical"
        />
      )}
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
              <Reveal custom={2.5} variant={'opacity'} elementClass="body" element={'div'} textContent={'NAVIGATING AN UN-INTERRUPTED STREAM OF MODERN CREATIVITY, BY DOCUMENTING A CURATED LINEUP OF ARTISTS & PROLIFICS.'}/>
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

const Section3 = ({ onHoverChange, featuredProjects, prevHover, setPrevHover, projectColour, setProjectColour }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const { x, y, isOutside } = useMousePosition(".App");
  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const [currentProject, setCurrentProject] = useState(''); // Initialize with first item's focusGenre
  const [wobble, setWobble] = useState({ translateY: 0, rotate: 0 }); // State for wobble effect
  const hoverDescRef = useRef(null);
  const wobbleTimeoutRef = useRef(null); // Ref to store the timeout


const currentYear = new Date().getFullYear();
const previousYear = currentYear - 1;



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
          left: `${x - 16}px`,
          top: `${y - 20}px`,
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

      <div className={`page-three ${isVisible ? "visible" : ""}`}>
      <div className="high-z-index-layer featured-work-wrap">
          <Reveal variant={'opacity'} textContent={`FEATURED WORK ( ${currentYear} / ${previousYear} )`}  element='p' elementClass="body" />
        </div>
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
                <img src={project.mainFeaturedImage?.blurhash} alt={project.id} style={{display:'none'}}/>
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




const Section4 = ({windowWidth}) => {
  const [mouseY, setMouseY] = useState(0);
  const [toggle, setToggle] = useState(false);
  const containerRef = useRef(null);
  const imageWrapRef = useRef(null);

  const serviceImage = [
    `${process.env.PUBLIC_URL}/animated-cormac.webp`,
    `${process.env.PUBLIC_URL}/Franco.png`,
    `${process.env.PUBLIC_URL}/animated-cormac.webp`,
  ];
  

  const handleMouseMove = (event) => {
    console.log(windowWidth)
    if (containerRef.current && imageWrapRef.current && windowWidth > 830) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseRelativeY = event.clientY - containerRect.top;

      const containerHeight = containerRef.current.clientHeight;
      const imageWrapHeight = imageWrapRef.current.clientHeight;

      // Calculate the top position ensuring it stays within the bounds
      let topPosition = mouseRelativeY - imageWrapHeight / 2;
      if (topPosition < 0) topPosition = 0;
      if (topPosition + imageWrapHeight > containerHeight) topPosition = containerHeight - imageWrapHeight;

      gsap.to(imageWrapRef.current, {
        top: topPosition,
        ease: "power3.out", // Apply easing for smooth movement
        duration: 0.5 // Adjust duration for desired responsiveness
      });
    }
  };
  

  const toggleService = () => {
    console.log(windowWidth)
      if(toggle || windowWidth <= 830){
        setToggle(false);
      } else {
        setToggle(true);
      }
  
  }

  const serviceImageAnimation = (i) => () => {
    console.log(windowWidth)
    if(windowWidth >= 830){
    gsap.to('.page-four-service-image', {
        y: `-${((window.innerWidth * 0.11) * (i - 1)) + (i - 1) * 20}px`,
        ease: "power3.inOut", // Smoother transition
        duration: 1 // Adjust the duration as needed
      });
    }
  
  };

  useEffect(() => {
    console.log(windowWidth)
    if (containerRef.current && imageWrapRef.current && windowWidth >= 830) {
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
          <p className="body">With years spent studying subtleties,</p>
          <p className="body">I shoot stories, with creatives, objects & companies.</p>
        </div>
        <div className="page-four-top-wrap-desc">
          <p className="body">Covering various visual disciplines,</p>
          <p className="body">Working with the inspired to produce the inspiring.</p>
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
          <div className="page-four-service-image" style={{backgroundImage:`url(${serviceImage[0]})`}}></div>
          <div className="page-four-service-image" style={{backgroundImage:`url(${serviceImage[1]})`}}></div>
          <div className="page-four-service-image" style={{backgroundImage:`url(${serviceImage[2]})`}}></div>
        </div>
        <div className="page-four-service-one page-four-service" onMouseEnter={serviceImageAnimation(1)}>
          {windowWidth <= 830 && (
            <img src={serviceImage[0]} alt="service-image" className="service-image-mobile"/>
          )}
          <Reveal custom={1} textContent={'Art-Direction'} element={"div"} elementClass={"title"} />
          <div className="service-desc">
            <p className="body">
              DEFINING STRONG CONCEPTUAL NARRATIVES BY NAVIGATING THE NUANCES OF A CLIENT’S REQUIREMENTS.
            </p>
          </div>
        </div>
        <div className="page-four-service-two page-four-service" onMouseEnter={serviceImageAnimation(2)}>
        {windowWidth <= 830 && (
            <img src={serviceImage[1]} alt="service-image" className="service-image-mobile"/>
          )}
          <Reveal custom={2} textContent={'Collaboration'} element={"div"} elementClass={"title"} />
          <div className="service-desc">
            <p className="body">
              SEEING EYE TO EYE WITH CREATIVES & PRODUCING VISUALS TO MATCH THEIR VISION.
            </p>
          </div>
        </div>
        <div className="page-four-service-three page-four-service" onMouseEnter={serviceImageAnimation(3)}>
        {windowWidth <= 830 && (
            <img src={serviceImage[2]} alt="service-image" className="service-image-mobile"/>
          )}
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
          <DynamicVideoPlayer image={'/animated_webp/visiontovision1.webp'} section={4} index={4} />
        </div>
        <div className="dynamic-video-player dynamic-video-player-4 middle">
          <DynamicVideoPlayer image={'/animated_webp/visiontovision2.webp'} section={4} index={4} />
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
      <div className="page-five-container">
      <div className="page-five-left">


      </div>
      <div className="page-five-right ">
        <div>
        <Reveal textContent={'Vision'} element={"h2"} elementClass={"heading"}/>
        <Reveal textContent={'To Vision'} element={"h2"} elementClass={"heading"}/>
        </div>
       
        <div className="home-about-desc">
          <Reveal textContent={'TRANSLATING CREATIVES IMAGINATION TO A STRUCTURED, INTUITIVE & INTENTIONAL APPROACH.'} custom={2} element={"p"} elementClass={"body"}/>
          <Reveal textContent={'BY EXPLORING & UNDERSTANDING THE PASSION OF PEERS. EXPRESSING THEIR OUTER-VIDUALISM*'} custom={2.5} element={"p"} elementClass={"body"}/>
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
    </div>
  )
}

const Section6  = forwardRef((props, section6Ref) => {
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
          <Reveal textContent={'REFERENCE PEACE AIMS TO BRIDGE THE GAP BETWEEN IMPRESSION & EXPRESSION; BY PUTTING A SPOTLIGHT ON UN-SPOTLIGHTED*'} element={"p"} elementClass={"body"}/>
          <div className="primary-button">
            Read More
          </div>
        </div>
      </div>
    
    </div>
  );
});




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
