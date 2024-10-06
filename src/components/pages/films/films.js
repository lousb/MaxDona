import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useFooter } from '../../../context/FooterContext';
import styles from './films.module.css';
import { db } from '../../../firebase/firebase';
import { collection, query, getDocs, limit, orderBy, onSnapshot } from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MouseCursor from "../../../utils/mouseCursor";
import Reveal from "../../../utils/textElementReveal/textElementReveal";
import { AnimatePresence , motion} from "framer-motion";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import DelayLink from "../../../utils/delayLink";
import useMousePosition from "../../../utils/useMousePosition";


gsap.registerPlugin(ScrollTrigger);

function Films() {
    const { dispatch } = useFooter();
    const [data, setData] = useState([]);
    const filmProjectItemsRef = useRef([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeView, setActiveView] = useState('slow');
    const [hoveredImage, setHoveredImage] = useState(null);
    const [mainImageLoaded, setMainImageLoaded] = useState(false); // Track main image loading
    const loadedImages = useRef(new Set()); // Cache to store loaded images


    const handleHoveredImageChange = ({ url, blurhash }) => {
        setHoveredImage({ url, blurhash });

        // Check if the image was already loaded before
        if (loadedImages.current.has(url)) {
            setMainImageLoaded(true);
        } else {
            setMainImageLoaded(false); // Reset loading state only if it's a new image
        }
    };

    const handleImageLoad = (url) => {
        loadedImages.current.add(url); // Add the URL to the loaded images cache
        setMainImageLoaded(true);
    };



    const handleViewChange = (view) => {
        setActiveView(view);
        setTimeout(() => {
            ScrollTrigger.refresh(true);  // Force refresh to recalculate pinned elements
        }, 800); // Add a slight delay to ensure DOM updates are complete before refresh
    };
    

    const handleDelayStart = (color) => {
        gsap.to(".film-page-title-wrap", { opacity: 0, duration: 0.2, ease:[0.76, 0, 0.24, 1] });
        setActiveView(null);
        if (color) {
            document.documentElement.style.setProperty('--secondary-dark', color);
        }
    };

    useEffect(() => {
        dispatch({ type: "Small" });
        return () => {
            dispatch({ type: "Default" });
        };
    }, [dispatch]);

    useEffect(() => {
        
        ScrollTrigger.refresh();
    }, [data]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "projects"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
        }, (error) => {
            console.error(error);
        });

        document.documentElement.style.setProperty('--primary-color', '#181818');
        document.documentElement.style.setProperty('--secondary-dark', 'rgb(10, 10, 10)');

        document.title = `Archive of Max Dona`;
       

        return () => unsub();
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        ScrollTrigger.refresh(true);
        applyScrollAnimations();

        const updateScrollTrigger = () => {
            setTimeout(() => {
                ScrollTrigger.refresh(true);
            }, 800); // Allow for DOM and layout updates
        };

        updateScrollTrigger();

        // Cleanup on unmount
        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [activeView, data]);

    

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
        };

        const handleScrollDebounced = debounce(handleScroll, 800);

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScrollDebounced);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScrollDebounced);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [data, activeView]);

    useEffect(() => {
        gsap.fromTo(".project-scroll-height", { height: '0px' }, { height: '100%', duration: 1, ease: [0.76, 0, 0.24, 1], delay: 1 });
    }, [useLocation()]);

    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

   const applyScrollAnimations = () => {
       // Clean up any existing ScrollTriggers
       ScrollTrigger.getAll().forEach((trigger) => {
           trigger.kill(); // Ensure each trigger is fully removed
       });
       ScrollTrigger.clearScrollMemory(); // Clear cached scroll positions


       if (activeView === 'slow' && data.length > 0) {
        
         
            slowViewAnimations();

       } else if (activeView === 'medium') {
           mediumViewAnimations();
       } else if (activeView === 'fast') {
           fastViewAnimations();
       }

       setTimeout(() => {
           ScrollTrigger.refresh(true);  // Ensure ScrollTrigger is refreshed
       }, 800);
   };
    
    
   const slowViewAnimations = () => {
       const filmProjectItems = document.querySelectorAll('.view-list-item-link');
       const itemHeight = (window.innerHeight * 0.7) - 90;
       const totalHeight = (data.length - 1) * itemHeight;
       const maxTranslateY = (data.length - 1) * 92;

       // Create the ScrollTrigger for pinning and scrolling
       ScrollTrigger.create({
           trigger: '.film-page-wrap',
           start: 'top top',
           pin: '.project-nav-wrap',
           end: () => `+=${totalHeight}`,
           invalidateOnRefresh: true,
           onUpdate: (self) => {
               const progress = self.progress * maxTranslateY;  // Directly calculate the translation
               filmProjectItems.forEach((item) => {
                   gsap.set(item, { y: `-${progress}%`, overwrite: 'auto' }); // Immediate set without easing
               });
           },
           onLeaveBack: () => {
               filmProjectItems.forEach((item) => {
                   gsap.set(item, { y: '0%' }); // Reset immediately to initial state
               });
           }
       });

       // Animate height of the scroll container
       gsap.fromTo('.film-project-scroll-container', {
           height: 'calc(70vh - 90px)',  // Start value
       }, {
           height: 'calc(100vh - 4vw - 84px)',  // End value
           scrollTrigger: {
               trigger: '.page-content',
               start: 'top top',
               end: '+=600px',
               scrub: true,
               id: "scrub-container",
               invalidateOnRefresh: true,
               onLeaveBack: () => {
                   // Reset height manually when scrolling back to the top
                   gsap.set('.film-project-scroll-container', { height: 'calc(70vh - 90px)' });
               }
           }
       });

       // Animate the title as the page scrolls
       gsap.to('.film-page-title-wrap', {
           y: '-300px',
           scrollTrigger: {
               trigger: document.body,
               start: 'top top',
               end: '500px top',
               scrub: true,
               id: "scrub-title",
               invalidateOnRefresh: true,
               onLeaveBack: () => {
                   // Reset height manually when scrolling back to the top
                   gsap.set('.film-page-title-wrap', { y: '90px' });
               }
           },
       });

       // Function to ensure refresh after all images load
       const ensureRefreshAfterLoad = () => {
           const images = document.querySelectorAll('img');
           let loadedCount = 0;

           images.forEach((img) => {
               if (img.complete) {
                   loadedCount++;
               } else {
                   img.onload = () => {
                       loadedCount++;
                       if (loadedCount === images.length) {
                           ScrollTrigger.refresh(); // Refresh once all images load
                       }
                   };
               }
           });

           if (loadedCount === images.length) {
               ScrollTrigger.refresh();
           }
       };

       // Debounce the refresh to avoid excessive calls
       const debounce = (func, delay) => {
           let timeout;
           return (...args) => {
               clearTimeout(timeout);
               timeout = setTimeout(() => func.apply(this, args), delay);
           };
       };

       // Ensure refresh after everything has loaded
       ensureRefreshAfterLoad();

       // Debounced refresh after content settles
       setTimeout(() => {
           ScrollTrigger.refresh(true);
       }, 800);

       // Debounced refresh on window resize
       window.addEventListener('resize', debounce(() => {
           ScrollTrigger.refresh();
       }, 300));  // Adjust the delay as needed
   };


   // Ensure ScrollTrigger recalculates after content is loaded or resized
   window.addEventListener('resize', () => {
       ScrollTrigger.refresh(); // Refresh on resize to handle layout changes
   });




    function mediumViewAnimations() {
        gsap.to('.film-page-title-wrap', {
            y: '-30vh',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: '500px top',
                scrub: true,
                id: "scrub",
            },
        });
    }

    const fastViewAnimations = () => {
       
        gsap.to('.film-page-title-wrap', {
            y: '-30vh',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: '500px top',
                scrub: true,
                id: "scrub",
            },
        });
    };

    useEffect(() => {
        const filmPageWrap = document.querySelector('.film-page-wrap');
        if (filmPageWrap) {
            if (activeView === 'slow') {
                const itemHeight = (window.innerHeight * 0.7) - 90;
                filmPageWrap.style.height = `${data.length * itemHeight - (itemHeight - window.innerHeight ) - (window.innerWidth * 0.04)}px`;
            } else {
                filmPageWrap.style.height = 'auto';
            }
        }

        // Ensure ScrollTrigger is refreshed
        setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 800); // Allow time for layout recalculations
    }, [activeView, data]);
    







    const hoverDescRef = useRef(null);
    const { x, y } = useMousePosition(".App");
    const [hoverDescHeight, setHoverDescHeight] = useState(0);
    const [prevX, setPrevX] = useState(0);
    const [prevY, setPrevY] = useState(0);
    const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
    const [currentProject, setCurrentProject] = useState(''); // Initialize with first item's focusGenre
    const [wobble, setWobble] = useState({ translateY: 0, rotate: 0 }); // State for wobble effect
    const wobbleTimeoutRef = useRef(null); // Ref to store the timeout
    const [projectColour, setProjectColour] = useState(0);
    const [prevHover, setPrevHover] = useState([data[0]]);
    const [lastHoveredIndex, setLastHoveredIndex] = useState(null);
    const [currentHoveredIndex, setCurrentHoveredIndex] = useState(null);

    const infiniteScrollData = data.length < 5 ? [...data, ...data.slice(0, 5 - data.length)] : data;

    const handleMouseLeave = () => {
        setCurrentHoveredIndex(null);
        gsap.to('.fast-hover-desc .link-desc > span', {
            y: '100%',
            duration: 0.2,
        });
    };

    useEffect(() => {
        if (currentHoveredIndex !== null && currentHoveredIndex !== lastHoveredIndex) {
            setLastHoveredIndex(currentHoveredIndex);
        }
    }, [currentHoveredIndex, lastHoveredIndex]);

    const handleMouseEnter = (item) => {
        setProjectColour(item.projectColor);
        gsap.to('.fast-hover-desc .link-desc > span', {
            y: '100%',
            duration: 0.3,
            onComplete: () => {
                setCurrentProject(item.focusGenre);
                gsap.to('.fast-hover-desc .link-desc > span', {
                    y: '100%',
                    color: item.projectColor,
                    opacity: 0,
                    duration: 0,
                    onComplete: () => {
                        gsap.to('.fast-hover-desc .link-desc > span', {
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

    useEffect(() => {
        const spanElement = document.querySelector('.fast-hover-desc .link-desc > span');

        if (activeView === 'fast') {
            gsap.to('.fast-hover-desc', {
                width: spanElement.clientWidth,
                duration: 0,
            });
            gsap.to('.fast-hover-desc', {
                height: spanElement.clientHeight,
                duration: 1,
            });
        }
    }, [currentProject, activeView]);

    const [slowViewClass, setSlowViewClass] = useState(false);
    

    useEffect(() => {
      let timer;
      if (activeView === 'slow') {
        // Set the timeout to add the class after 0.8s
        timer = setTimeout(() => {
          setSlowViewClass(true);
        }, 800); // Delay of 0.8 seconds
      }else{
        timer = setTimeout(() => {
          setSlowViewClass(false);
        }, 0);
      }

      return () => {
        clearTimeout(timer);
        setSlowViewClass(false); // Reset when the view changes
      };
    }, [activeView]);
    
    

    return (
   
        <div className={`${styles['film-page']}`}>
            <div className={`${styles['view-switcher-wrap']} view-switcher-wrap`}>
                <div className={`${styles['view-bracket-wrap']} view-bracket-wrap`}>
                    <div className={`${styles['view-bracket']} body`}>
                        (
                    </div>
                    <div className={`${styles['view-bracket']} body`}>
                        )
                    </div>
                </div>

                <button className={`body ${styles['slow-toggle']} ${activeView === 'slow' ? styles['view-toggle-active']:''}`} onClick={() => handleViewChange('slow')}>Row</button>
                <button className={`body ${styles['fast-toggle']} ${activeView === 'fast' ? styles['view-toggle-active']:''}`} onClick={() => handleViewChange('fast')}>List</button>
                <button className={`body ${styles['medium-toggle']} ${activeView === 'medium' ? styles['view-toggle-active']:''}`} onClick={() => handleViewChange('medium')}>Grid</button>
            </div>
 
        <div className={`${styles['film-page-wrap']} film-page-wrap ${activeView === 'fast' && 'fast-active'}`}>
                
        <AnimatePresence>
            {activeView === 'fast' && hoveredImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 1, duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className={`${styles['floating-project-thumb-wrap']} floating-project-thumb-wrap`}
                >
                    <div>
                        <ParallaxImage
                            imageUrl={!mainImageLoaded ? hoveredImage?.blurhash : hoveredImage?.url}
                            className={`${styles['floating-project-image']} floating-project-image`}
                        />

                        {/* Invisible main image for loading */}
                        <img
                            src={hoveredImage.url}
                            alt="Main featured"
                            style={{ display: 'none' }}
                            onLoad={() => handleImageLoad(hoveredImage.url)}
                        />

                        <div className={`body ${styles['floating-project-name']} floating-project-name`}></div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

             
    
            <div className={`${styles['film-page-title-wrap']} film-page-title-wrap high-z-index-layer`}>
                <Reveal elementClass={'title'} element={'h2'} textContent={'ARCHIVE:'}/>
                <div className={`${styles['film-page-intro-desc-wrap']} film-page-intro-desc-wrap`}>
                    <Reveal elementClass={`body ${styles['film-page-intro-desc']}`} element={'p'} textContent={'My work speaks to the collective influence & care of those who bring it to life & the distinct outcome of each creator-client collaboration.'}/>
                   
                </div>
                <div className={`body scroll-notification ${styles['scroll-notification']}`}>
                    <p>
                    (<span>SCROLL</span>)
                    </p>
                </div>
       
            </div>
            <div className={`${styles['project-nav-wrap']} project-nav-wrap`}>
            <AnimatePresence>
                {activeView === 'slow' && (
                    <motion.div
                        className={`${styles['project-wrap']} project-wrap ${slowViewClass ? styles['slow-view'] : ''}`}
                        key="slow"
                        initial={{ opacity: 0, y:window.innerHeight * 0.2 }}
                        animate={{ opacity: 1, y:'0%', transition: { duration: 1, delay: 0.6, ease:[0.76, 0, 0.24, 1] } }}
                        exit={{ opacity: 0, y:window.innerHeight * 0.2 }}
                        transition={{ duration: 0.6, ease:[0.76, 0, 0.24, 1] }}
                    >
                        <SlowView data={data} filmProjectItemsRef={filmProjectItemsRef} handleDelayStart={handleDelayStart}/>
                    </motion.div>
                 )}
               
               {activeView === 'fast' && (
                <>
                <div
                  className={`fast-hover-desc`}
                  ref={hoverDescRef}
                  style={{
                    position: "fixed",
                    left: `${x - 16}px`,
                    top: `${y - 20}px`,
                    transform: `translateY(${wobble.translateY}px) rotate(${wobble.rotate}deg)`,
                  }}
                >
                  <div className={`fast-hover-svg-wrap`}>
                    <svg width="17" height="25" viewBox="0 0 17 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={`fast-hover-arrow`}>
                    <path style={{ fill: `${projectColour}` }} fill-rule="evenodd" clip-rule="evenodd" d="M2.0078 4.99998H0.29C0.193334 4.99998 0 4.95453 0 4.77271V0.22727C0 0 0.348 0 0.580001 0H1.74023H6.38H6.38086H8.12023H11.2382H12.1809H16.2405V4.63965V6.37983V10.4395V10.4473H16.2435V16.2471C16.2435 16.4791 16.2435 16.8271 16.0053 16.8271H11.2411C11.0506 16.8271 11.0029 16.6338 11.0029 16.5371V10.7739C11.0009 10.7578 11 10.7427 11 10.7295V8.99603L6.39529 13.6006L6.39552 13.6008L3.92365 16.0726C3.82477 16.1715 3.67646 16.3198 3.50954 16.1529L0.171188 12.8146C0.037654 12.6811 0.0866662 12.5653 0.127864 12.5241L1.48753 11.1645L1.4873 11.1642L7.65128 5.00047H2.03023C2.02257 5.00047 2.01509 5.0003 2.0078 4.99998Z" fill="#181818"/>
                    </svg>
                  </div>

                  <p className={`body link-desc`}>
                    <span dangerouslySetInnerHTML={{ __html: currentProject }}></span>
                  </p>
                </div>
                <motion.div
                       className={`${styles['project-wrap']} high-z-index-layer project-wrap`}
                       key="fast"
                       initial={{ opacity: 0, y: window.innerHeight * 0.2 }}
                       animate={{ opacity: 1, y: '0%', transition: { duration: 1, delay: 0.6, ease: [0.76, 0, 0.24, 1] } }}
                       exit={{ opacity: 0, y: window.innerHeight * 0.2 }}
                       transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                   >
                       <FastView data={data} filmProjectItemsRef={filmProjectItemsRef} onHoverImage={handleHoveredImageChange} handleDelayStart={handleDelayStart} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} setCurrentHoveredIndex={setCurrentHoveredIndex}
                       />
                   </motion.div>
                </>
                   
               )}
                 {activeView === 'medium' && (
                    <motion.div
                        className={`${styles['project-wrap']} project-wrap`}
                        key="medium"
                        initial={{ opacity: 0, y:window.innerHeight * 0.2 }}
                        animate={{ opacity: 1, y:'0%', transition: { duration: 1, delay: 0.6, ease:[0.76, 0, 0.24, 1] } }}
                        exit={{ opacity: 0, y:window.innerHeight * 0.2 }}
                        transition={{ duration: 0.6, ease:[0.76, 0, 0.24, 1] }}
                    >
                        <MediumView data={data} filmProjectItemsRef={filmProjectItemsRef} handleDelayStart={handleDelayStart}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </div>
        </div>
    );
}

const SlowView = ({ data, filmProjectItemsRef, handleDelayStart }) => {
    const [mainImageLoaded, setMainImageLoaded] = useState(false);
    const [allImagesLoaded, setAllImagesLoaded] = useState(false); // Track if all images are loaded

    useEffect(() => {
        // Check if all images are loaded whenever the data changes
        const checkAllImagesLoaded = () => {
            const images = Array.from(document.images);
            const allLoaded = images.every(img => img.complete);
            if (allLoaded) {
                setAllImagesLoaded(true); // Set state once all images are loaded
                console.log('all images are loaded')
            }
        };

        // Attach an event listener for each image load
        data.forEach((project, index) => {
            const imgElement = filmProjectItemsRef.current[index]?.querySelector('img');
            if (imgElement) {
                if (imgElement.complete) {
                    checkAllImagesLoaded(); // Check immediately if already loaded
                } else {
                    imgElement.onload = checkAllImagesLoaded; // Check once loaded
                    imgElement.onerror = checkAllImagesLoaded; // Handle loading errors
                }
            }
        });

        return () => {
            // Cleanup any potential event listeners when the component unmounts
            data.forEach((project, index) => {
                const imgElement = filmProjectItemsRef.current[index]?.querySelector('img');
                if (imgElement) {
                    imgElement.onload = null;
                    imgElement.onerror = null;
                }
            });
        };
    }, [data, filmProjectItemsRef]);

    return (
        <div className={`slow-view  ${styles['film-project-scroll-wrap']}`}>
            <div className={`body film-project-scroll-container ${styles['film-project-scroll-container']}`}>
                <div className={`project-scroll-height ${styles['project-scroll-height']}`}>
                    {data.map((project, index) => (
                        <DelayLink 
                            onDelayStart={() => handleDelayStart(project.projectColor)}  
                            delay={1500}  
                            to={`/archive/${project.id}`} 
                            className={`view-list-item-link ${styles['view-list-item-link']}`} 
                            key={`slow-${project.id}-${index}`} // Ensure unique key
                        >
                            <div
                                style={{ backgroundImage: `url(${project?.mainFeaturedImage?.blurhash}`}}
                                ref={(el) => (filmProjectItemsRef.current[index] = el)}
                                className={`${styles['film-project-item']} film-project-item`}
                            >
                                <img
                                  src={project?.mainFeaturedImage?.url}
                                  alt="main featured"
                                  onLoad={() => setMainImageLoaded(true)}
                                />
                                {index === 0 ? (
                                    <div>
                                        <h2 className={`header-reduced ${styles['film-project-title']} ${styles['film-project-desc-item']}`}>
                                            {project.displayName}
                                        </h2>
                                        <h3 className={`body ${styles['film-project-director']} ${styles['film-project-desc-item']}`} >
                                            Directed by Max Dona
                                        </h3>
                                        <div className={`body ${styles['film-project-video-name']} ${styles['film-project-desc-item']}`} >
                                            {project.videoName} ({new Date(project.releaseDate).getFullYear()})
                                        </div>
                                        <p className={`primary-button ${styles['film-project-cta']} ${styles['film-project-desc-item']}`}>FULL PROJECT</p>
                                    </div>
                                ) : (
                                    <div className="project-item-details">
                                        <h2 className={`header-reduced ${styles['film-project-title']} ${styles['film-project-desc-item']}`} style={{paddingBottom:'14px'}}>
                                            <Reveal custom={0} textContent={project.displayName} element={"span"} elementClass={`heading`} />
                                        </h2>
                                        <h3 className={`body ${styles['film-project-director']} ${styles['film-project-desc-item']}`} >
                                            <Reveal custom={1} textContent={"Directed by Max Dona"} element={'p'} elementClass={"body"} />
                                        </h3>
                                        <div className={`body ${styles['film-project-video-name']} ${styles['film-project-desc-item']}`} >
                                            <Reveal custom={2} textContent={`${project.videoName} (${new Date(project.releaseDate).getFullYear()})`} element={'p'} elementClass={"body"} />
                                        </div>
                                        <div className={` ${styles['film-project-cta']} ${styles['film-project-desc-item']}`} >
                                            <Reveal custom={3} textContent={`FULL PROJECT`} element={'p'} elementClass={`primary-button ${styles['film-project-cta']} ${styles['film-project-desc-item']}`} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DelayLink>
                    ))}
                </div>
            </div>
        </div>
    );
};



const MediumView = ({ data, handleDelayStart }) => {
    const [randomImagesWithInfo, setRandomImagesWithInfo] = useState([]);



    useEffect(() => {
        
        fetchRandomImages();
    }, []);

    const fetchRandomImages = async () => {
        const allImages = [];

        data.forEach((project) => {
            for (let i = 1; i <= 3; i++) {
                const imageUrls = project.imageUrls[`image${i}`];
                if (imageUrls && Array.isArray(imageUrls)) {
                    imageUrls.forEach((image, indexWithinProject) => {
                        const imageUrl = image.url;
                        const blurhash = image.blurhash;
                        const imageId = image.id;
                        const projectColor = project.projectColor;
                        if (imageUrl && blurhash) {
                            allImages.push({ imageUrl, blurhash, project, indexWithinProject, imageId, projectColor });
                        }
                    });
                }
            }
        });

        const shuffledImages = shuffleArray(allImages);
        const randomImages = shuffledImages.slice(0, 25);

        const imagesWithInfo = randomImages.map(({ imageUrl, blurhash, project, indexWithinProject, imageId, projectColor }) => {
            return { imageUrl, blurhash, project, indexWithinProject, imageId, projectColor };
        });

        setRandomImagesWithInfo(imagesWithInfo);
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        setTimeout(() => {
            const masonrySection = document.querySelector(`.${styles['random-masonry-image-view']} > div > div`);

            if (masonrySection) {
                const childCount = masonrySection.childElementCount;

                for (let i = 0; i < childCount; i++) {
                    const child = masonrySection.children[i];
                    child.classList.add(`column-${i + 1}`);
                    child.classList.add(`masonry-column`);
                }

                const calculateTallestColumnHeight = () => {
                    let tallestHeight = 0;
                    const columns = document.querySelectorAll(`.${styles['random-masonry-image-view']} .masonry-column`);
                    columns.forEach((column) => {
                        const height = column.offsetHeight;
                        if (height > tallestHeight) {
                            tallestHeight = height;
                        }
                    });
                    return tallestHeight;
                };

                const tallestColumnHeight = calculateTallestColumnHeight();
                const columns = document.querySelectorAll(`.${styles['random-masonry-image-view']} .masonry-column`);

                columns.forEach((column) => {
                    const columnHeight = column.offsetHeight;
                    const difference = tallestColumnHeight - columnHeight;

                    gsap.to(column, {
                        marginTop: difference,
                        scrollTrigger: {
                            trigger: `.${styles['random-masonry-image-view']}`,
                            start: `-90px top`,
                            end: () => `+=${tallestColumnHeight - (window.innerHeight / 2.5)}`,
                            scrub: true,
                        },
                    });
                });
            } else {
                console.log('No masonry section found.');
            }
        }, 1000);
    }, [randomImagesWithInfo]);

    return (
        <div className={`${styles['random-masonry-image-view']} random-masonry-image-view`}>
            <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 500: 2, 830: 3, 900: 4 }}>
                <Masonry columnsCount={4} gutter="1.4vw">
                    {randomImagesWithInfo.map((imageInfo, index) => (
                        
                        <DelayLink 
                            delay={1500} 
                            onDelayStart={() => handleDelayStart(imageInfo.projectColor)}  
                            to={`/archive/${imageInfo.project.id}/${imageInfo.imageId}`} 
                            key={`medium-${imageInfo.project.id}-${index}`} // Ensure unique key
                        >
                            <ParallaxImage 
                                key={`medium-image-${index}`} 
                                imageUrl={imageInfo.imageUrl} 
                                blurhash={imageInfo.blurhash} 
                                className={`${styles['random-masonry-image']}`} 
                            />
                        </DelayLink>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    );
};



const ParallaxImage = ({ imageUrl, blurhash, handleDelayStart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [maskPosition, setMaskPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);
    
    const initialObjectPosition = "center center";
  
    const handleMouseMove = (e) => {
      if (!isHovered) return;
      const { clientX, clientY, target } = e;
  
      const { left, top, width, height } = target.getBoundingClientRect();
  
      const maskCenterX = left + width / 2;
      const maskCenterY = top + height / 2;
  
      const distanceX = clientX - maskCenterX;
      const distanceY = clientY - maskCenterY;
  
      const sensitivity = 0.01;
  
      const x = distanceX * sensitivity;
      const y = distanceY * sensitivity;
  
      setMaskPosition({ x, y });
    };
  
    const handleMouseEnter = () => {
      if (imageRef.current) {
        imageRef.current.style.transition =
          "ease all 200ms";
        setIsHovered(true);
        setTimeout(() => {
          if (imageRef.current) {
            imageRef.current.style.transition =
              "cubic-bezier(0.76, 0, 0.24, 1) all 0ms, object-position 0s ease";
          }
        }, 600);
      }
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
      if (imageRef.current) {
        imageRef.current.style.transition =
          "ease all 200ms";
          imageRef.current.style.transform = "translate(0px, 0px) scale(1.1)";
      }
    };
  
    return (
      <div
        className={styles['parallax-image-wrap']}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Parallax Image"
          className={styles['masonry-image']}
          style={{
            transform: `translate(${maskPosition.x}px, ${maskPosition.y}px) scale(1.1)`,
          }}
        />
      </div>
    );
  };

  const FastView = ({ data, filmProjectItemsRef, onHoverImage, handleDelayStart, onMouseEnter, onMouseLeave }) => {
    const [lastHoveredIndex, setLastHoveredIndex] = useState(0);
    const [currentHoveredIndex, setCurrentHoveredIndex] = useState(null);
    

    const infiniteScrollData = data.length < 5 ? [...data, ...data.slice(0, 5 - data.length)] : data;

    const handleHoverImage = (url, blurhash, index, project) => {
        onHoverImage({ url, blurhash });
        setCurrentHoveredIndex(index);

        onMouseEnter(project);
    };

    const handleMouseLeave = () => {
        setCurrentHoveredIndex(null);


        onMouseLeave();
    };

    useEffect(() => {
        if (currentHoveredIndex !== null && currentHoveredIndex !== lastHoveredIndex) {
            setLastHoveredIndex(currentHoveredIndex);
        }
    }, [currentHoveredIndex, lastHoveredIndex]);




   


      return (
          <div className={`infinite-scroll-map-wrap  ${styles['infinite-scroll-map-wrap']}`}>
            
              {infiniteScrollData.map((project, index) => (
                <div className={`${styles['fast-project-wrap']} ${(lastHoveredIndex === index || currentHoveredIndex === index) ? `hovered-fast-project-wrap` : ''}`}>
                    <div className={`project-color`} style={{ backgroundColor: project.projectColor }}></div>
                    <DelayLink
                        delay={1500}
                        to={`/archive/${project.id}`}
                        onDelayStart={() => handleDelayStart(project.projectColor)}
                        className={`view-list-item-link view-list-item-link `}
                        key={`fast-link-${project.id}-${index}`}
                    >
                        <div
                            onMouseEnter={() => handleHoverImage(project?.mainFeaturedImage?.url, project?.mainFeaturedImage?.blurhash, index, project)}
                            onMouseLeave={handleMouseLeave}
                            className={`infinite-film-project-item  film-project-item ${styles['infinite-film-project-item']} ${(lastHoveredIndex === index || currentHoveredIndex === index) ? 'hovered-project' : ''}`}
                            key={`fast-item-${project.id}-${index}`}
                        >
                            <h2 className={`title infinite-film-title`}>
                                {project.displayName}
                            </h2>
                        </div>
                    </DelayLink>
                </div>
                
              ))}
          </div>
      );
  };




export default Films;
