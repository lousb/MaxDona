import React, {useEffect, useRef, useLayoutEffect, useState} from "react";
import styles from './about.module.css'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MouseCursor from "../../../utils/mouseCursor";
import Reveal from "../../../utils/textElementReveal/textElementReveal";
import { useLocation } from "react-router-dom";
import ContactBlock from "../../molecules/ContactBlock/contactBlock";
import DelayLink from "../../../utils/delayLink";

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
                setIsHovered(true);
            } else if (event.type === 'mouseleave') {
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
        document.title = `About Max Dona`;

        document.documentElement.style.setProperty('--primary-color', '#181818');
        document.documentElement.style.setProperty('--secondary-dark', 'rgb(10, 10, 10)');
    
        // Add event listener for window resize
        window.addEventListener("resize", handleResize);
    
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);


      const serviceImage = [
        `${process.env.PUBLIC_URL}/static_webp/aboutservice1.webp`,
        `${process.env.PUBLIC_URL}/static_webp/aboutservice2.webp`,
        `${process.env.PUBLIC_URL}/static_webp/aboutservice3.webp`,
      ];

      const [hoveredSlide, setHoveredSlide] = useState(null); // Shared hover state

    const handleMouseEnter = (id) => {
      setHoveredSlide(id); // Set hovered slide
    };

    const handleMouseLeave = () => {
      setHoveredSlide(null); // Reset hover state
    };
    
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
                      <img src="/animated_webp/about/aboutHero.webp" alt="max-about-hero"/>
                    </div>
                    <div className={`high-z-index-layer ${styles['section-1-text-wrap']}`}>
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
                                    <Reveal custom={20} elementClass={'body'} textContent={'This is only done by caring about your project as much as you do.'} element={'p'}/>
                                </div>
                                {windowWidth > 830 &&
                                    <>
                                    <DelayLink to={'https://www.instagram.com/macsdona/'} delay={1500}>
                                    <button className="primary-button button-gradient">Instagram</button>
                                    </DelayLink>
                                    <DelayLink to={'/contact'} delay={1500}>
                                    <button className="primary-button button-gradient">Get in Touch</button>
                                    </DelayLink>
                                    </>
                                }
                                
                            </div>
                            <div className={`${styles['section-2-heading-title']}`}>
                                <Reveal elementClass={'title'} element={'h2'} textContent={'YOUR'}/>
                                <Reveal elementClass={'title'} element={'h2'} textContent={'PASSION.'}/>
                                <Reveal elementClass={'title'} element={'h2'} textContent={'MY CRAFT.'}/>
                                <Reveal elementClass={'title'} element={'h2'} textContent={'PERFECTLY'}/>
                                <Reveal elementClass={'title'} element={'h2'} textContent={'SYNCED.'}/>
                                {windowWidth <= 830 &&
                                    <div className={`${styles['section-2-button-wrap']}`}>
                                    <button className="primary-button button-gradient">Instagram</button>
                                    <button className="primary-button button-gradient">Get in Touch</button>
                                    </div>
                                }
                            </div>
                           
                            
                        </div>
                    </div>
                </div>

            </section>

            <div className={`${styles["portfolio-slide"]} ${styles["about-page-slide"]}`} ref={slider1}>
                <div  className={`${styles["slide-projects-wrap"]}`} ref={imagesWrap1}>
                    {portfolioImages(1, hoveredSlide, handleMouseEnter, handleMouseLeave)}
                    {portfolioImages(2, hoveredSlide, handleMouseEnter, handleMouseLeave)}
                </div>
               
            </div>

            <div className={`${styles["portfolio-slide-subtext"]} high-z-index-layer`}>
                    <div className={`${styles["portfolio-slide-subtext-left"]}`}>
                        <p className="body">
                        DEVELOPING VISUALS TO HELP CREATIVE’S EXPRESS THEMSELVES THROUGH MEDIA.
                        </p>
                    </div>
                    <div className={`${styles["portfolio-slide-subtext-right"]}`}>
                        {/* <p className="body">
                            ( Click project to view )
                        </p> */}
                        <DelayLink to={'/archive'} delay={1500}>
                        <button className="primary-button">
                            Full Archive
                        </button>
                        </DelayLink>
                     
                    </div>
                </div>

            <section className={`${styles['about-page-section-3']} ${styles['about-process']} about-process`} ref={aboutProcess}>
                    
                    <div className={`${styles['about-process-wrap']} about-process-wrap `} ref={processWrap}>
                        <div className="">
                            <h2 className={` ${styles['my-process-title']} heading high-z-index-layer`}>My Process:</h2>
                        </div>
                       
                        <div className={`${styles['about-process-image-wrap']} about-process-image-wrap`}>
                            <div className={`${styles['about-process-inner-image-wrap']} about-process-inner-image-wrap`}>
                                <img src={serviceImage[0]} alt="max-image"></img>
                                <img src={serviceImage[1]} alt="max-image"></img>
                                <img src={serviceImage[2]} alt="max-image"></img>
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
                            <img src={serviceImage[0]} alt="max-image"></img>
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
                            <img src={serviceImage[1]} alt="max-image"></img>
                            <p className={`${styles['about-process-count']} heading`}>
                                01
                            </p>
                        </div>
                        <div className={`${styles['about-process-slide-title']} heading`}>Design:</div>
                            <Reveal custom={-1}  elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`A well-defined design system provides the structure needed for creativity to thrive, aligning every element with the overarching vision. Through this I’m able to iterate closely and define a strong conceptual blueprint.`}/>
                            <Reveal custom={-1} elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`By exploring your initial intentions, what you can see and what you want to see — We’re able to push boundaries & maximise outcomes. This allows me to identify & act on the weight of your ideas, lightening your workload.`}/>
                        </div>

                    <div className={`${styles['about-process-slide-3']} ${styles['about-process-slide']}`}>
                        <div className={`${styles['mobile-process-image-wrap']} mobile-process-image-wrap`}>
                            <img src={serviceImage[2]} alt="max-image"></img>
                            <p className={`${styles['about-process-count']} heading`}>
                                01
                            </p>
                        </div>
                        <div className={`${styles['about-process-slide-title']} heading`}>Define:</div>
                            <Reveal custom={-1} elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`Using bold solutions via shot selection, and scene by scene intuition— I actively reference the outlined objectives—Guiding my techniques during the shoot. `}/>
                            <Reveal custom={-1} elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`At the intersection of ideation & implementation we balance on-site serendipity with a structured narrative, ensuring every shot is relevant and our pre-defined goals come to fruition.`}/>
                            <Reveal custom={-1} elementClass={`${styles['about-process-slide-text']} body`} element={'div'} textContent={`This production process enhances efficiency, and ultimately elevates the experience, leaving lasting visuals that resonate & reflect our intentions. Seamlessly integrating with post-production and amplifying the final result.`}/>
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
                  <DelayLink to={'/contact'} delay={1500}>
                  <button className="primary-button">
                      Lets Work
                  </button>
                  </DelayLink>
                   
                </div>
            </div>

            <div className={`${styles["testimonials-slide"]} ${styles["about-page-slide"]}`} ref={slider2}>
                <div  className={`${styles["slide-projects-wrap"]}`} ref={imagesWrap2}>
                    {testimonialImages(1, hoveredSlide, handleMouseEnter, handleMouseLeave)}
                    {testimonialImages(2, hoveredSlide, handleMouseEnter, handleMouseLeave)}
                </div>
            </div>
            <div className={`${styles["about-contact-block"]} ${styles["about-contact-block"]}`}>
                <ContactBlock/>
            </div>
        </main>
    )
}



const portfolioImages = (i, hoveredSlide, handleMouseEnter, handleMouseLeave) => {
  const slideData = [
    { id: 1, name: 'Franco', year: '2022', img: 'Gif1.webp' },
    { id: 2, name: 'Domengo', year: '2022', img: 'Gif2.webp' },
    { id: 3, name: 'Cormac', year: '2022', img: 'Gif3.webp' },
    { id: 4, name: 'Teji', year: '2022', img: 'Gif4.webp' },
    { id: 5, name: 'Teji', year: '2022', img: 'Gif5.webp' }
  ];

  return (
    <div className={`${styles["slide-projects"]} ${i !== 1 ? 'second-' : ''}slide-projects`}>
      {slideData.map((slide) => (
        <div
          key={slide.id}
          className={`${styles["slide-project"]} ${styles[`slide-project-${slide.id}`]} ${hoveredSlide === slide.id ? styles['hovered'] : ''}`}
          onMouseEnter={() => handleMouseEnter(slide.id)}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={styles["slide-project-image"]}
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/animated_webp/about/${slide.img})` }}
          />
          <div className={styles['slide-project-details']}>
            <p className="body"><span>{slide.name}</span></p>
            <p className="body"><span>({slide.year})</span></p>
            <p className={`primary-button ${styles['primary-button']}`}><span>Full Project</span></p>
          </div>
        </div>
      ))}
    </div>
  );
};
  
  


const testimonialImages = (i, hoveredSlide, handleMouseEnter, handleMouseLeave) => {
  const testimonialData = [
    { id: 1, name: 'Franco' },
    { id: 2, name: 'Domengo' },
    { id: 3, name: 'Cormac'},
    { id: 4, name: 'Teji' },
  ];

  return (
    <div className={`${styles["slide-projects"]} ${i !== 1 ? 'second-' : ''}slide-projects`}>
      {testimonialData.map((testimonial) => (
        <div
          key={testimonial.id}
          className={`${styles["slide-project"]}-${i} ${styles["slide-project"]} ${hoveredSlide === testimonial.id ? styles['hovered'] : ''}`}
          onMouseEnter={() => handleMouseEnter(testimonial.id)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`${styles["slide-project-image"]} ${styles["testimonial-image"]}`}>
            {/* Image or background logic can be added here */}
          </div>
          <div className={styles['slide-project-details']}>
            <p className="body"><span>{testimonial.name}</span></p>
            <p className={`primary-button ${styles['primary-button']}`}><span>Full Project</span></p>
          </div>
        </div>
      ))}

      {i === 2 && (
        <div
          className={`${styles["slide-project"]}-${i} ${styles["slide-project"]} ${hoveredSlide === 1 ? styles['hovered'] : ''}`} // Ensure duplicate hover works
          onMouseEnter={() => handleMouseEnter(1)}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`${styles["slide-project-image"]}`}>
            {/* Image or background logic for the duplicated item */}
          </div>
          <div className={styles['slide-project-details']}>
            <p className="body"><span>{testimonialData[0].name}</span></p>
            <p className={`primary-button ${styles['primary-button']}`}><span>Full Project</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

const InstagramGallery = ({ i, hoveredSlide, handleMouseEnter, handleMouseLeave }) => {
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with your valid access token
      
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url&access_token=${accessToken}`
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setInstagramPosts(data.data);
      } catch (err) {
        console.error('Failed to fetch Instagram posts:', err);
        setError(err.message);
      }
    };

    fetchInstagramPosts();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (instagramPosts.length === 0) {
    return <div>Loading Instagram posts...</div>;
  }

  return (
    <div className={`${styles["slide-projects"]} ${i !== 1 ? 'second-' : ''}slide-projects`}>
      {instagramPosts.map((post) => (
        <div
          key={post.id}
          className={`${styles["slide-project"]}-${i} ${styles["slide-project"]} ${hoveredSlide === post.id ? styles['hovered'] : ''}`}
          onMouseEnter={() => handleMouseEnter(post.id)}
          onMouseLeave={handleMouseLeave}
        >
          <a href={post.permalink} target="_blank" rel="noopener noreferrer">
            <div className={`${styles["slide-project-image"]} ${styles["instagram-image"]}`}>
              <img src={post.media_url} alt={post.caption || "Instagram Post"} />
            </div>
          </a>
          <div className={styles['slide-project-details']}>
            <p className="body"><span>{post.caption || "Instagram Post"}</span></p>
            <p className={`primary-button ${styles['primary-button']}`}>
              <span>View on Instagram</span>
            </p>
          </div>
        </div>
      ))}

      {i === 2 && instagramPosts[0] && (
        <div
          className={`${styles["slide-project"]}-${i} ${styles["slide-project"]} ${hoveredSlide === instagramPosts[0].id ? styles['hovered'] : ''}`}
          onMouseEnter={() => handleMouseEnter(instagramPosts[0].id)}
          onMouseLeave={handleMouseLeave}
        >
          <a href={instagramPosts[0].permalink} target="_blank" rel="noopener noreferrer">
            <div className={`${styles["slide-project-image"]}`}>
              <img src={instagramPosts[0].media_url} alt={instagramPosts[0].caption || "Instagram Post"} />
            </div>
          </a>
          <div className={styles['slide-project-details']}>
            <p className="body"><span>{instagramPosts[0].caption || "Instagram Post"}</span></p>
            <p className={`primary-button ${styles['primary-button']}`}>
              <span>View on Instagram</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};


  
  

export default About;