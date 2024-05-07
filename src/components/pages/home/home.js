import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import './home.css';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


import MouseCursor from "../../../utils/mouseCursor";
import Reveal from "../../../utils/textElementReveal/textElementReveal";
import SvgComponent from "../../atoms/referencePeaceSVG/referencePeaceSVG";
import { projectNavData } from "./projectNavDetails";
import { motion } from "framer-motion";
import { opacity } from "./anim";
import { Link, Navigate, useLocation } from "react-router-dom";
import TickingClock from "../../atoms/animatedTimer/animatedtimer";
import FlipNumbers from "react-flip-numbers";
import DelayLink from "../../../utils/delayLink";

gsap.registerPlugin(ScrollTrigger);

function Home() {

    const imageRef = useRef(null);
    const welcomeSectionRef = useRef(null);
    const aboutReferenceSectionRef = useRef(null);
    const section3Ref = useRef(null);

    const [isSection3Visible, setIsSection3Visible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    let xPercent = 0;
    let direction = -1;

  

    const [hoveredItem, setHoveredItem] = useState(null);

    const handleHoverChange = (item) => {
      setHoveredItem(item);
    };
    
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
        


      gsap.fromTo('.scroll-notification', {
        opacity:0,
      },{
        opacity:1,
        delay:0.1,
      })
      
      const sectionOneScrollTrigger = () => {
        ScrollTrigger.create({
          trigger: ".page-one",
          start: "top top",
          pin: ".dynamic-video-player-1",
          end: () => welcomeSectionRef.current.offsetTop + welcomeSectionRef.current.clientHeight - windowHeight - 120,
        });
      };
  
      const pageFiveScrollTrigger = () => {
        ScrollTrigger.create({
          trigger: aboutReferenceSectionRef.current,
          pin: '.page-five',
          start: '-92px top',
          end: 'bottom bottom',
        });
      };



      const handleMinWidth831 = () => {
        // gsap.to(".dynamic-video-player-1 .mask-image", { maxWidth: "68.5vw",         width: 'calc(68.5vw)', });

        const aboutReferenceSectionScrollTrigger = () => {
          ScrollTrigger.create({
            trigger: aboutReferenceSectionRef.current,
            start: '-92px top',
            pin: '.dynamic-video-player-5',
            end: 'bottom bottom',
          });
        };
        
  
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
          height: 'calc(95vh - 180px)',
  
        },{
          height: 'calc(100vh - 10vw)',
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
          '-webkit-filter':'blur(10px)',
          filter: 'blur(10px)',
          width: "92vw",
          maxWidth:"92vw",
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
          maxWidth:"92vw",
          scrollTrigger: {
            trigger: '.page-six',
            start: "-600px top",
            end: "-550px top",
            scrub: 2,
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
          y: -40,
          scrollTrigger: {
            trigger: section3Ref.current, 
            start: () => '80px top',
            end: () => welcomeSectionRef.innerHeight + windowWidth/0.8,
            scrub: true,
            id: "scrub",
          },
        });
        gsap.to(".dynamic-video-player-1 .mask-mouse-area", {
          y: 20,
          scrollTrigger: {
            trigger: section3Ref.current, 
            start: () => '80px top',
            end: () => welcomeSectionRef.innerHeight + windowWidth/0.8,
            scrub: true,
            id: "scrub",
          },
        });
    
        
        pageFiveScrollTrigger();
        aboutReferenceSectionScrollTrigger();
      };
  
  


      
  
      const handleWindowLess830 = () => {

        ScrollTrigger.create({
          trigger: document.window,
          start: "top center",
          pin: ".dynamic-video-player-1 .text-content-mobile-scrollbar",
          end: () => welcomeSectionRef.current.offsetTop + welcomeSectionRef.current.clientHeight - windowHeight - 120,
 
        });

        const aboutReferenceSectionScrollTrigger = () => {
          ScrollTrigger.create({
            trigger: '.dynamic-video-player-5',
            start:`top -${window.innerHeight - document.querySelector('.dynamic-video-player-5 .mask-image-wrap').innerHeight}px`,
            pin: '.dynamic-video-player-5',
            end: `+=${window.innerHeight*2}px`,
          });
        };

        gsap.to('.dynamic-video-player-5 .mask-mouse-area',{
          height: 'calc(100vh - 8vw)',
          scrollTrigger: {
            trigger: '.dynamic-video-player-5',
            start: `top top`, // Adding 4vw to the bottom
            end:()=> '+=100vh',
            scrub: true,
            id: "scrub",
            markers:true
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
      
  
      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }, [windowWidth, windowHeight, welcomeSectionRef, aboutReferenceSectionRef, section3Ref]);


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
        gsap.fromTo(".App", { opacity: 0 }, { opacity: 1, duration:1 });
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

  // const handleClick = (link) => {
  //   // Programmatically navigate to a new location using navigate function
  //   navigate("/new-path");
  // };

    return (
        <main className="home" >
            {windowWidth > 830 && <MouseCursor/>}
             
            <section className="page" ref={welcomeSectionRef}>
         
                 {isSection3Visible && <div className="header-background-gradient" />}

                <div className={`${windowWidth < 830 ? 'small-dynamic-video-player':''} dynamic-video-player dynamic-video-player-1`} ref={imageRef} >
                    <DynamicVideoPlayer index={1} data={projectNavData} hoveredItem={hoveredItem} image="/franco.png" isSection3Visible={isSection3Visible} section={1} windowWidth={windowWidth}/>
                    <div className="text-content-mobile-scrollbar">
                      <div className="text-content-mobile-scrollbar-thumb"></div>
                    </div>
                </div>
                {windowWidth < 830 ? <Section1 windowWidth={windowWidth}/>:<></>}

                <section className="text-content-layer first-three-sections">
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
                <DynamicVideoPlayer image={'/Max-About.png'} section={5} />
             
              </div>
              <Section5 title={'About'}/>
              <Section6 title={'ReferencePeace'}/>
              <Section7 title={'ReferencePeace-2'}/>
            </div>
        </main>
    );
}

const DynamicVideoPlayer = ({ image, isSection3Visible, windowWidth, data, hoveredItem, index}) => {
    const maskRef = useRef(null);
    const imageRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const initialObjectPosition = "center top"; 

    const initialStyles = {
      width: "68.5vw",
      height: "100%", 
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
        imageRef.current.style.transition = "object-position 0.5s ease, min-width 0.5s ease-out 0s"; // Enable transition for smooth hover effect
    
      setIsHovered(true);
      setTimeout (()=>{
        imageRef.current.style.transition = "object-position 0s ease, min-width 0.5s ease-out 0s"; // Disable transition for smooth hover effect
    }, 600);

    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
      imageRef.current.style.transition = "object-position 0.5s ease"; // Apply transition for smooth mouse leave effect
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


const videoRef = useRef(null);

useEffect(() => {
  if (videoRef.current) {
    videoRef.current.currentTime = 0;

    ScrollTrigger.create({
      trigger: ".first-three-sections",
      start: "top top",
      scrub: 0,

      onUpdate: (self) => {
        const targetTime = videoRef.current.duration * self.progress;
        videoRef.current.currentTime = targetTime;
      }
    });
  }
}, []);
  

// Linear interpolation function
function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}



    return (
      <div className={`mask-mouse-area area-${index}`} >
        
  
        <DelayLink
        to={`${hoveredItem ? hoveredItem.link : (data && data.length > 0 ? data[0].link : '')}`} // Specify the destination link here
        delay={1500} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
        onDelayStart={handleDelayStart} // Callback when delay starts
        onDelayEnd={handleDelayEnd} // Callback when delay ends and navigation happens
      >
 
        <div className="mask-image-wrap" ref={maskRef}>
          {index === 1 && 
          <video
          
            className="scroll-video"

            ref={videoRef} id="v0" preload="preload"

            muted
        
          >
            <source src="/test-scroll.mp4" type="video/mp4" />
          </video>
          }
        <div className="reference-peace-bg-gradient">

        </div>
        
        {image ? (
          <img
          className="mask-image"
          src={image}
          style={initialStyles}
          ref={imageRef}
          alt="Franco"
          />
        ):(
          <img
          className="mask-image"
          src={determineImage()}
          style={initialStyles}
          ref={imageRef}
          alt="Franco"
        />
        )}
       

          <div className="details">
            
            <div className="player-project-name">
            {hoveredItem ? ( // Check if an item is hovered
              <div>
                <p className="artist-name">
                  <span className="artist-name-span">{hoveredItem.textContent}</span>
                </p>
                <p>
                  <span>{hoveredItem.projectName}</span>
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
                  <p>No data available</p>
                </div>
              )
            )}


              
            
            </div>
          </div>
          <div className="body scroll-notification">
     
            <p onClick={()=>scrollToPercentageOfViewportHeight(85)}>
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
                <button className=" primary-button">Full Archive</button>
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
      const { offsetTop, clientHeight } = sectionRef.current;
      const sectionHeight = clientHeight;
      const scrollPosition = window.scrollY + window.innerHeight;
      const triggerPoint = offsetTop + sectionHeight * 1.15;
  
      const isTriggered = scrollPosition >= triggerPoint;
  
      setIsVisible(isTriggered);
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
                     <Reveal custom={2} variant={'opacity'} textContent={'My work'} element={'button'} elementClass={"primary-button"} onClick={()=>scrollToPercentageOfViewportHeight(190)} />
                  </span>
            </div>
        </div>
  )
};

const Section3 = ({data, onHoverChange}) => {
  
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [prevHover, setPrevHover] = useState(data[0]);
  
    useEffect(() => {
      const handleScroll = () => {
        const { offsetTop, clientHeight } = sectionRef.current;
        const sectionHeight = clientHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        const triggerPoint = offsetTop + sectionHeight * 0.80;
    
        const isTriggered = scrollPosition >= triggerPoint;
    
        setIsVisible(isTriggered);
      };
    
      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Call it initially to set the initial state
    
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseEnter = (item) => {
      onHoverChange(item);
      setPrevHover(item);
    };


    return (
      <section className={`page-three-wrap`} ref={sectionRef}>
            <div className="high-z-index-layer">
         <Reveal variant={'opacity'} textContent='FEATURED WORK ( 2023 / 2022 )' element='p' elementClass="body"/>
        </div>
      <div className={`page-three ${isVisible ? "visible" : ""}`}>
    
      
        <span className="heading home-project-list">
          {data.map((item) => (
              <div key={item.id}    className={`title ${prevHover && prevHover.id === item.id ? "prev-hover" : ""}`} onMouseEnter={() => {
                onHoverChange(item);
                handleMouseEnter(item);
            }}>
            <DelayLink 
                to={item.link}
                delay={1500} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
                onDelayStart={handleDelayStart} // Callback when delay starts
                onDelayEnd={handleDelayEnd} // Callback when delay ends and navigation happens
               >
            <Reveal
              key={item.id}
              custom={item.id}
              textContent={item.textContent}
              element="div"
              elementClass={`title`}
             
            />
            </DelayLink>
            </div>
            
          ))}
        </span>
        
   
      </div>
      <button className="primary-button high-z-index-layer">Full Archive</button>
      </section>
    );
};


const Section4 = () =>(

    <div className="page-four high-z-index-layer">
      <div className="page-four-top-wrap">
        <div>
          <p className="title-body">
            What I Do:
          </p>
        </div>
        <div className="page-four-top-wrap-desc">
          <p className="body">Covering varius visual diciplines</p>
          <p className="body">Working with the inspired to produce the inspiring</p>
        </div>
        <div className="">
          <p className="primary-button what-i-do-cta">
            Instagram
          </p>
        </div>
      </div>
      <div className="page-four-middle-wrap">
        <div className="page-four-service-one page-four-service">
          
         <Reveal custom={1} textContent={'Art Direction'} element={"div"} elementClass={"title"}/>
          <div className="service-desc">
            <div className="service-img-wrap">
              <img src="/imagery/Mask-group-1.png"></img>
            </div>

            <p className="body">
              DEFINING STRONG CONCEPTUAL NARRATIVES BY NAVIGATING THE NUANCES OF A CLIENT’S REQUIREMENTS.
            </p>
          </div>
        </div>
        <div className="page-four-service-two page-four-service">

          <Reveal custom={2} textContent={'Collaboration'} element={"div"} elementClass={"title"}/>


          <div className="service-desc">
            <div className="service-img-wrap">
              <img src="/imagery/Mask-group-1.png"></img>
            </div>
            <p className="body">
              SEEING EYE TO EYE WITH CREATIVES & PRODUCING VISUALS TO MATCH tHEIR VISION.
            </p>
          </div>
        </div>
        <div className="page-four-service-three page-four-service">
          <Reveal custom={3} textContent={'Production'} element={"div"} elementClass={"title"}/>
          <div className="service-desc">
            <div className="service-img-wrap">
              <img src="/imagery/Mask-group-1.png"></img>
            </div>
            <p className="body">
            END TO END EXECUTION
            WITH THE SAME LEVEL OF INTENTION THROUGHOUT,<br/>
            FROM PRE <span>&#8594;</span> POST PRODUCTION.
            </p>
          </div>
        </div>
      </div>
      <div className="page-four-bottom-wrap">
        <DelayLink
         to={`/contact`} // Specify the destination link here
         delay={1500} // Set the delay in milliseconds (e.g., 1000ms = 1 second)
         onDelayStart={handleDelayStart} // Callback when delay starts
         onDelayEnd={handleDelayEnd} // Callback when delay ends and navigation happens
         >
        <div className="primary-button">
          Let's work
        </div>
        </DelayLink>
      </div>
    </div>

)
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
        <Reveal variant={'opacity'} textContent={"Get to know me"} element={'p'} elementClass={"primary-button"}/>
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

  const handleDelayStart = (e, to) => {
    gsap.to(".mask-mouse-area", { alignItems:'start', duration: 0});
    gsap.to(".body", { opacity: '0', duration: 0.2, ease:[0.76, 0, 0.24, 1]});
    gsap.to(".details", { opacity: '0', duration: 0.2, ease:[0.76, 0, 0.24, 1]});
    gsap.to(".mask-mouse-area > a", { height: '0', duration: 0.8,delay:0.7, ease:[0.76, 0, 0.24, 1]});

    gsap.to('.arrow-cursor-image', {
      y: "-70%",
      duration: 2,
      ease:[0.76, 0, 0.24, 1]
    });
  };

  const handleDelayEnd = (e, to) => {
    // You can perform actions when the delay ends and navigation happens, if needed
    console.log(`Delay ended for link to ${to}`);
  };

export default Home;
