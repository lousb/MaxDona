import React, {useEffect, useRef, useLayoutEffect, useState} from "react";
import styles from './about.module.css'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MouseCursor from "../../../utils/mouseCursor";
import Reveal from "../../../utils/textElementReveal/textElementReveal";
import { useLocation } from "react-router-dom";
import ContactBlock from "../../molecules/ContactBlock/contactBlock";

gsap.registerPlugin(ScrollTrigger);

function About(){

    const imagesWrap1 = useRef(null);
    const imagesWrap2 = useRef(null);
    const slider1 = useRef(null);
    const slider2 = useRef(null);
    const processWrap = useRef(null);
    const aboutProcess = useRef(null);
    const [xPercent, setXPercent] = useState(0);
    const [direction, setDirection] = useState(-1);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isHovered, setIsHovered] = useState(false);


   useLayoutEffect(() => {
       // Initialize GSAP context
       const ctx = gsap.context(() => {
           // Create ScrollTrigger instance
           ScrollTrigger.create({
               trigger: aboutProcess.current,
               start: "-80px top",
               pin: processWrap.current,
               end: 'bottom bottom',
               pinSpacing: false, // Set to false if you don't want extra space
           });

           // Additional animations or configurations if needed
       }, [processWrap, aboutProcess]);

       // Cleanup function
       return () => {
           ctx.revert();
       };
   }, []);


   // GSAP ScrollTrigger Animations
      useLayoutEffect(() => {
       const ctx = gsap.context(() => {
           gsap.to('.about-process-index span', {
               scrollTrigger: {
                   trigger: aboutProcess.current,
                   scrub: 0.5,
                   start: '100px top',
                   end: 'bottom bottom',
               },
               y: '-200%',
           });

           gsap.to('.about-process-slides', {
               scrollTrigger: {
                   trigger: aboutProcess.current,
                   scrub: 0.5,
                   start: 'bottom bottom',
                   end: 'bottom 300px',
               },
               y: '-190px',
               opacity: '0',
           });

           gsap.to('.about-process-inner-image-wrap', {
               scrollTrigger: {
                   trigger: aboutProcess.current,
                   scrub: 0.8,
                   start: '100px top',
                   end: 'bottom bottom',
               },
               y: '-70%',
           });

           gsap.to(slider1.current, {
               scrollTrigger: {
                   trigger: slider1.current,
                   scrub: 1,
                   start: `-=${window.innerHeight * 1.5} top`,
                   end: `+=${window.innerHeight * 2}`, // Extend end point by 50vh (1.5 times the viewport height)
                   onUpdate: e => setDirection(e.direction * -1), // Update direction
               },
               x: () => `-${slider1.current.scrollWidth / 6}px`, // Use dynamic value
               ease: "none", // Smooth transition
               markers:true,
           });

           // Slider 2 Animation
           gsap.to(slider2.current, {
               scrollTrigger: {
                   trigger: slider2.current,
                   scrub: 1,
                   start: `-=${window.innerHeight * 1.5} top`,
                   end: `+=${window.innerHeight * 2}`, // Extend end point by 50vh (1.5 times the viewport height)
                   onUpdate: e => setDirection(e.direction * -1), // Update direction
               },
               x: () => `-${slider2.current.scrollWidth / 6}px`, // Use dynamic value
               ease: "none", // Smooth transition
            
           });


       }, [processWrap, aboutProcess, slider1, slider2]);

       return () => ctx.revert();
   }, []);

   // Custom Animation
   useLayoutEffect(() => {
     let animationFrameId;

     const animation = () => {
       setXPercent(prevXPercent => {
        let newXPercent = prevXPercent + 0.04 * direction;

         // Loop back based on direction
         if (direction === -1) {
           if (newXPercent <= -100) {
             newXPercent = 0; // Reset to start
           }
         } else if (direction === 1) {
           if (newXPercent >= 0) {
             newXPercent = -100; // Loop back to start
           }
         }

         return newXPercent;
       });

       animationFrameId = requestAnimationFrame(animation);
     };

     animationFrameId = requestAnimationFrame(animation);

     // Cleanup function
     return () => {
       cancelAnimationFrame(animationFrameId);
     };
   }, [direction]);

   // Update GSAP with the latest xPercent
   useLayoutEffect(() => {
     if (imagesWrap1.current && imagesWrap2.current) {
       gsap.to(imagesWrap1.current, { xPercent, duration: 0 }); // Adjust duration as needed
       gsap.to(imagesWrap2.current, { xPercent, duration: 0 }); // Adjust duration as needed
     }
   }, [xPercent]);

   useLayoutEffect(() => {
        const handleHover = (event) => {
            if (event.type === 'mouseenter') {
                console.log('Slider2 is hovered');
                setIsHovered(true);
            } else if (event.type === 'mouseleave') {
                console.log('Slider2 is not hovered');
                setIsHovered(false);
            }
        };

        const element = slider2.current;
        element.addEventListener('mouseenter', handleHover);
        element.addEventListener('mouseleave', handleHover);

        return () => {
            element.removeEventListener('mouseenter', handleHover);
            element.removeEventListener('mouseleave', handleHover);
        };
    }, []);

    let location = useLocation();

    useEffect(() => {
        gsap.fromTo(".section-1-image", { height:'0px' }, { height: 'calc(100vh - 80px - 18vw', duration: 1, ease:[0.76, 0, 0.24, 1], delay:0.2});
        
    }, [location]);

    useEffect(() => {
        // Function to handle window resize
        function handleResize() {
          setWindowWidth(window.innerWidth);
        }
    
        // Add event listener for window resize
        window.addEventListener("resize", handleResize);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);



    
    
    return(
        <main className={`${styles['about-page']}`}>

            <section className={`${styles['about-page-section-1']}`}>
                <div className={`${styles['section-1-content']} `}  >
                    <div className={`${styles['section-1-heading']} high-z-index-layer`}>
                        <Reveal custom={20} elementClass={'title'} element={'h2'} textContent={'TELLING STORIES WORTH'}/>
                        <Reveal custom={20} elementClass={'title'} element={'h2'} textContent={'Being'}/>
                        <Reveal custom={20} elementClass={'title'} element={'h2'} textContent={'told.'}/>
                    </div>
                    <div className={`${styles['section-1-image']} section-1-image`}>
                    
                    </div>
                    <div className={`high-z-index-layer`}>
                        <div className={`${styles['section-1-text']}`}>
                            <Reveal custom={20} elementClass={'body'} textContent={'MY WORK AIMS TO STANDOUT FROM THE NOISE; THIS IS DONE BY HIGHLIGHTING THE AUTHENTICITY OF MY CLIENTS.'} element={'p'}/>
                        </div>
                        <div className={`body scroll-notification ${styles['scroll-notification']}`}>
                            <p>
                            (<span>SCROLL</span>)
                            </p>
                        </div>

                    </div>
                </div>

            </section>
            <section className={`${styles['about-page-section-2']}`}>
                <div className={`${styles['section-2-content']} `}  >
                    <div className={`${styles['section-2-heading']} high-z-index-layer`}>
                   
                        <div className={`${styles['section-2-heading-bottom']} high-z-index-layer`}>
                            <div className={`${styles['section-2-heading-subtitle']}`}>
                                <div className={`${styles['section-2-text']}`}>
                                    <Reveal custom={20} elementClass={'body'} textContent={'I STRIVE TO CURATE IDENTITY AND PERSONALITY THROUGH VISUAL EXPERIENCES.'} element={'p'}/>

                                </div>
                                
                                <button className="primary-button button-gradient">Instagram</button>
                                <button className="primary-button button-gradient">Get in Touch</button>
                            </div>
                            <div className={`${styles['section-2-heading-title']}`}>
                                <Reveal elementClass={'title'} element={'h2'} textContent={'TALK ABOUT'}/>
                                <Reveal elementClass={'title'} element={'h2'} textContent={'YOURSELF'}/>
                                <Reveal elementClass={'title'} element={'h2'} textContent={'HERE, GOT IT'}/>
                            </div>
                            
                        </div>
                    </div>
                </div>

            </section>

            <div className={`${styles["portfolio-slide"]} ${styles["about-page-slide"]}`} ref={slider1}>
                <div  className={`${styles["slide-projects-wrap"]}`} ref={imagesWrap1}>
                    {portfolioImages(1)}
                    {portfolioImages(2)}
                </div>
               
            </div>

            <div className={`${styles["portfolio-slide-subtext"]} high-z-index-layer`}>
                    <div className={`${styles["portfolio-slide-subtext-left"]}`}>
                        <p className="body">
                        DEVELOPING VISUALS TO HELP CREATIVE’S EXPRESS THEMSELVES THROUGH MEDIA.
                        </p>
                    </div>
                    <div className={`${styles["portfolio-slide-subtext-right"]}`}>
                        <p className="body">
                            ( Click project to view )
                        </p>
                        <button className="primary-button">
                            Full Archive
                        </button>
                    </div>
                </div>

            <section className={`${styles['about-page-section-3']} ${styles['about-process']} about-process`} ref={aboutProcess}>
                    
                    <div className={`${styles['about-process-wrap']} about-process-wrap `} ref={processWrap}>
                        <div className="">
                            <h2 className={` ${styles['my-process-title']} heading high-z-index-layer`}>My Process:</h2>
                        </div>
                       
                        <div className={`${styles['about-process-image-wrap']} about-process-image-wrap`}>
                            <div className={`${styles['about-process-inner-image-wrap']} about-process-inner-image-wrap`}>
                                <img src='/max-about.png' alt="max-image"></img>
                                <img src='/Max-Headshot.png' alt="max-image"></img>
                                <img src='/Franco.png' alt="max-image"></img>
                            </div>
                            <div className={`${styles['about-process-image-wrap']} about-process-image-wrap`}>
                            <p className={`${styles['about-process-count']} heading`}>
                                0
                                <p className={`${styles['about-process-index']} about-process-index`}>
                                    <span className="heading">1</span>
                                    <span className="heading">2</span>
                                    <span className="heading">3</span>
                                </p>
                            </p>
                        </div>
                    </div>
                     
           
                
                </div>
                <div className={`${styles['about-process-slides']} about-process-slides high-z-index-layer`}>
                    <div className={`${styles['about-process-slide-1']} ${styles['about-process-slide']}`}>
                        <div className={`${styles['mobile-process-image-wrap']} mobile-process-image-wrap`}>
                            <img src='/max-about.png' alt="max-image"></img>
                            <p className={`${styles['about-process-count']} heading`}>
                                01
                            </p>
                        </div>
                        <div className={`${styles['about-process-slide-title']} heading high-z-index-layer`}>Discover:</div>
                        <Reveal custom={-1} elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`STARTING with a thorough BRANDING examination BY peering into the core of your identity, decoding the competitive landscape & paving a WAY through YOUR SPECIFIC industry.`}/>
                        <Reveal custom={-1} elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`My mission is to help your brand carve its own path, resonate with your audience, and establish an identity that's exclusively yours.`}/>
                    </div>

                    <div className={`${styles['about-process-slide-2']} ${styles['about-process-slide']}`}>
                        <div className={`${styles['mobile-process-image-wrap']} mobile-process-image-wrap`}>
                            <img src='/Max-Headshot.png' alt="max-image"></img>
                            <p className={`${styles['about-process-count']} heading`}>
                                01
                            </p>
                        </div>
                        <div className={`${styles['about-process-slide-title']} heading`}>Design:</div>
                            <Reveal custom={-1}  elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`STARTING with a thorough BRANDING examination BY peering into the core of your identity, decoding the competitive landscape & paving a WAY through YOUR SPECIFIC industry.`}/>
                            <Reveal custom={-1} elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`My mission is to help your brand carve its own path, resonate with your audience, and establish an identity that's exclusively yours.`}/>
                        </div>

                    <div className={`${styles['about-process-slide-3']} ${styles['about-process-slide']}`}>
                        <div className={`${styles['mobile-process-image-wrap']} mobile-process-image-wrap`}>
                            <img src='/Franco.png' alt="max-image"></img>
                            <p className={`${styles['about-process-count']} heading`}>
                                01
                            </p>
                        </div>
                        <div className={`${styles['about-process-slide-title']} heading`}>Define:</div>
                            <Reveal custom={-1} elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`STARTING with a thorough BRANDING examination BY peering into the core of your identity, decoding the competitive landscape & paving a WAY through YOUR SPECIFIC industry.`}/>
                            <Reveal custom={-1} elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`My mission is to help your brand carve its own path, resonate with your audience, and establish an identity that's exclusively yours.`}/>
                    </div>
                </div>
                        
            </section>

            <div className={`${styles["testimonial-slide-subtext"]} high-z-index-layer`}>
                <div className={`${styles["testimonial-subtext-col-1"]}`}>
                    <p className="body">
                        Recent<br/>
                        Succesful<br/>
                        Clients
                    </p>
                    <p className={`body ${styles["testimonial-click"]}`}>
                        ( Click to View )
                    </p>
                </div>
                <div className={`${styles["testimonial-subtext-col-2"]}`}>
                    <p className="heading">
                        COLLABORATIVE<br/>Outcome's
                    </p>

                </div>
                <div className={`${styles["testimonial-subtext-col-3"]}`}>
                    <button className="primary-button">
                        Lets Work
                    </button>
                </div>
            </div>

            <div className={`${styles["testimonials-slide"]} ${styles["about-page-slide"]}`} ref={slider2}>
                <div  className={`${styles["slide-projects-wrap"]}`} ref={imagesWrap2}>
                    {testimonialImages(1)}
                    {testimonialImages(2)}
                </div>
            </div>
            <div className={`${styles["about-contact-block"]} ${styles["about-contact-block"]}`}>
                <ContactBlock/>
            </div>
        </main>
    )
}



const portfolioImages = (i) => {

    return(
        <div className={`${styles["slide-projects"]} ${i !== 1 ? 'second-' :''}slide-projects`} >
            
            <div className={`${styles["slide-project"]}-${i} ${styles["slide-project"]}`}>
                <div className={`${styles["slide-project-image"]}`}>

                </div>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Franco</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>
            <div className={`${styles["slide-project"]}${i} ${styles["slide-project"]}`}>
                <div className={`${styles["slide-project-image"]}`}>

                </div>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Domengo</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>
            <div className={`${styles["slide-project"]}${i} ${styles["slide-project"]}`}>
                <div className={`${styles["slide-project-image"]}`}>

                </div>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Cormac</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>
            <div className={`${styles["slide-project"]}${i} ${styles["slide-project"]}`}>
                <div className={`${styles["slide-project-image"]}`}>

                </div>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Teji</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>

            {i===2?<>
                <div className={`${styles["slide-project"]}-${i} ${styles["slide-project"]}`}>
                <div className={`${styles["slide-project-image"]}`}>

                </div>
                <div className={`${styles['slide-project-details']}`}>
                    <p className="body" ><span>Franco</span></p>
                    <p className="body"><span>Old Ways</span></p>
                    <p className="body"><span>( 2022 )</span></p>
                </div>
            </div>
            </>:<>
                
            </>}
        </div>
    )
    
}


const testimonialImages = (i) => {

    return(
        <div className={`${styles["slide-projects"]} ${i !== 1 ? 'second-' :''}slide-projects`} >
           <div className={`${styles["slide-project"]}-${i} ${styles["slide-project"]}`}>
               <div className={`${styles["slide-project-image"]}`}>

               </div>
               <div className={`${styles['slide-project-details']}`}>
                   <p className="body" ><span>Franco</span></p>
                   <p className="body"><span>Old Ways</span></p>
                   <p className="body"><span>( 2022 )</span></p>
               </div>
           </div>
           <div className={`${styles["slide-project"]}${i} ${styles["slide-project"]}`}>
               <div className={`${styles["slide-project-image"]}`}>

               </div>
               <div className={`${styles['slide-project-details']}`}>
                   <p className="body" ><span>Domengo</span></p>
                   <p className="body"><span>Old Ways</span></p>
                   <p className="body"><span>( 2022 )</span></p>
               </div>
           </div>
           <div className={`${styles["slide-project"]}${i} ${styles["slide-project"]}`}>
               <div className={`${styles["slide-project-image"]}`}>

               </div>
               <div className={`${styles['slide-project-details']}`}>
                   <p className="body" ><span>Cormac</span></p>
                   <p className="body"><span>Old Ways</span></p>
                   <p className="body"><span>( 2022 )</span></p>
               </div>
           </div>
           <div className={`${styles["slide-project"]}${i} ${styles["slide-project"]}`}>
               <div className={`${styles["slide-project-image"]}`}>

               </div>
               <div className={`${styles['slide-project-details']}`}>
                   <p className="body" ><span>Teji</span></p>
                   <p className="body"><span>Old Ways</span></p>
                   <p className="body"><span>( 2022 )</span></p>
               </div>
           </div>

           {i===2?<>
               <div className={`${styles["slide-project"]}-${i} ${styles["slide-project"]}`}>
               <div className={`${styles["slide-project-image"]}`}>

               </div>
               <div className={`${styles['slide-project-details']}`}>
                   <p className="body" ><span>Franco</span></p>
                   <p className="body"><span>Old Ways</span></p>
                   <p className="body"><span>( 2022 )</span></p>
               </div>
           </div>
           </>:<>

           </>}
        </div>
    )
    
}

export default About;