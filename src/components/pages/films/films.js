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
        const unsub = onSnapshot(collection(db, "projects"), (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
                list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
        }, (error) => {
            console.error(error);
        });

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
       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
       const filmProjectItems = document.querySelectorAll('.film-project-item');
       const itemHeight = window.innerHeight * 0.8 - 90;
       const totalHeight = (data.length - 1) * itemHeight;
       const maxTranslateY = (data.length - 1) * 100 - 20.8;

       ScrollTrigger.create({
           trigger: '.film-page-wrap',
           start: 'top top',
           pin: '.film-page-wrap',
           end: () => `+=${totalHeight}`,
           onUpdate: (self) => {
               const progress = self.progress * maxTranslateY;
               filmProjectItems.forEach((item) => {
                   gsap.to(item, { y: `-${progress}%`, ease: 'none' });
               });
           },
       });

       gsap.fromTo('.film-project-scroll-container', {
           height: 'calc(70svh - 90px)',
       }, {
           height: 'calc(100svh - 4vw - 90px)',
           scrollTrigger: {
               trigger: '.page-content',
               start: 'top top',
               end: '600',
               scrub: true,
               id: "scrub",
           },
       });

       gsap.fromTo('.film-project-item', {
           height: 'calc(70svh - 90px)'
       }, {
           height: 'calc(80svh - 90px)',
           scrollTrigger: {
               trigger: '.page-content',
               start: 'top top',
               end: '200',
               scrub: true,
               id: "scrub",
           },
       });

       gsap.to('.film-page-title-wrap', {
           y: '-300px',
           scrollTrigger: {
               trigger: document.body,
               start: 'top top',
               end: '500px top',
               scrub: true,
               id: "scrub",
           },
       });
   };


    const mediumViewAnimations = () => {
        gsap.fromTo('.random-masonry-image-view', {
            marginTop: '10vw'
        }, {
            marginTop: '0px',
            scrollTrigger: {
                trigger: '.film-page-wrap',
                start: 'top top',
                end: '1000',
                scrub: true,
                id: "scrub",
            },
        });
    };

    const fastViewAnimations = () => {
        gsap.fromTo('.infinite-scroll-map-wrap', {
            marginTop: '10vw'
        }, {
            marginTop: '0px',
            scrollTrigger: {
                trigger: '.film-page-wrap',
                start: 'top top',
                end: '1000',
                scrub: true,
                id: "scrub",
            },
        });
    };

    useEffect(() => {
        const filmPageWrap = document.querySelector('.film-page-wrap');
        if (filmPageWrap) {
            if (activeView === 'slow') {
                const itemHeight = window.innerHeight * 0.8 - 90;
                filmPageWrap.style.height = `${data.length * itemHeight}px`;
            } else {
                filmPageWrap.style.height = 'auto';
            }
        }

        // Ensure ScrollTrigger is refreshed
        setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 800); // Allow time for layout recalculations
    }, [activeView, data]);
    
    
    

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
                    <Reveal elementClass={`body ${styles['film-page-intro-desc']}`} element={'p'} textContent={'USE THIS SPACE TO TALK GENRALLY ABOUT YOUR PROJECTS, INTENTIONS OR INSPIRATIONS - MAKE IT CLEAR WHAT THEY MEAN TO YOU!'}/>
                   
                </div>
                <div className={`body scroll-notification ${styles['scroll-notification']}`}>
                    <p>
                    (<span>SCROLL</span>)
                    </p>
                </div>
       
            </div>
            <div className={`${styles['project-nav-wrap']}`}>
            <AnimatePresence>
                {activeView === 'slow' && (
                    <motion.div
                        className={`${styles['project-wrap']} project-wrap`}
                        key="slow"
                        initial={{ opacity: 0, y:'20%' }}
                        animate={{ opacity: 1, y:'0%', transition: { duration: 1, delay: 0.4, ease:[0.76, 0, 0.24, 1] } }}
                        exit={{ opacity: 0, y:'50%' }}
                        transition={{ duration: 0.8, ease:[0.76, 0, 0.24, 1] }}
                    >
                        <SlowView data={data} filmProjectItemsRef={filmProjectItemsRef} handleDelayStart={handleDelayStart}/>
                    </motion.div>
                )}
               
               {activeView === 'fast' && (
                   <motion.div
                       className={`${styles['project-wrap']} project-wrap`}
                       key="fast"
                       initial={{ opacity: 0, y: '20%' }}
                       animate={{ opacity: 1, y: '0%', transition: { duration: 1, delay: 0.4, ease: [0.76, 0, 0.24, 1] } }}
                       exit={{ opacity: 0, y: '20%' }}
                       transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                   >
                       <FastView data={data} filmProjectItemsRef={filmProjectItemsRef} onHoverImage={handleHoveredImageChange} handleDelayStart={handleDelayStart} />
                   </motion.div>
               )}
                 {activeView === 'medium' && (
                    <motion.div
                        className={`${styles['project-wrap']} project-wrap`}
                        key="medium"
                        initial={{ opacity: 0, y:'20%' }}
                        animate={{ opacity: 1, y:'0%', transition: { duration: 1, delay: 0.4, ease:[0.76, 0, 0.24, 1] } }}
                        exit={{ opacity: 0, y:'20%' }}
                        transition={{ duration: 0.8, ease:[0.76, 0, 0.24, 1] }}
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

    return (
        <div className={`slow-view ${styles['film-project-scroll-wrap']}`}>
            <div className={`body film-project-scroll-container ${styles['film-project-scroll-container']}`}>
                <div className={`project-scroll-height ${styles['project-scroll-height']}`}>
                    {data.map((project, index) => (
                        <DelayLink 
                            onDelayStart={() => handleDelayStart(project.projectColor)}  
                            delay={1500}  
                            to={`/projects/${project.id}`} 
                            className={`view-list-item-link ${styles['view-list-item-link']}`} 
                            key={`slow-${project.id}-${index}`} // Ensure unique key
                        >
                            <div
                                style={{ backgroundImage: `url(${mainImageLoaded ? project?.mainFeaturedImage?.url : project?.mainFeaturedImage?.blurhash})`}}
                                ref={(el) => (filmProjectItemsRef.current[index] = el)}
                                className={`${styles['film-project-item']} film-project-item`}
                            >
                                <img
                                  src={project?.mainFeaturedImage?.url}
                                  alt="main featured"
                                  style={{ display: 'none' }}
                                  onLoad={() => setMainImageLoaded(true)}
                                />
                                {index === 0 ? (
                                    <>
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
                                    </>
                                ) : (
                                    <>
                                        <h2 className={`header-reduced ${styles['film-project-title']} ${styles['film-project-desc-item']}`}>
                                            <Reveal custom={0} textContent={project.displayName} element={"span"} elementClass={`heading`} />
                                        </h2>
                                        <h3 className={`body ${styles['film-project-director']} ${styles['film-project-desc-item']}`} >
                                            <Reveal custom={1} textContent={"Directed by Max Dona"} element={'p'} elementClass={"body"} />
                                        </h3>
                                        <div className={`body ${styles['film-project-video-name']} ${styles['film-project-desc-item']}`} >
                                            <Reveal custom={2} textContent={`${project.videoName} (${new Date(project.releaseDate).getFullYear()})`} element={'p'} elementClass={"body"} />
                                        </div>
                                        <div className={`primary-button ${styles['film-project-cta']} ${styles['film-project-desc-item']}`} >
                                            <Reveal custom={3} textContent={`FULL PROJECT HERE`} element={'p'} elementClass={`primary-button ${styles['film-project-cta']} ${styles['film-project-desc-item']}`} />
                                        </div>
                                    </>
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
                        if (imageUrl && blurhash) {
                            allImages.push({ imageUrl, blurhash, project, indexWithinProject });
                        }
                    });
                }
            }
        });

        const shuffledImages = shuffleArray(allImages);
        const randomImages = shuffledImages.slice(0, 25);

        const imagesWithInfo = randomImages.map(({ imageUrl, blurhash, project, indexWithinProject }) => {
            return { imageUrl, blurhash, project, indexWithinProject };
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
            <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 500: 2, 700: 3, 900: 4 }}>
                <Masonry columnsCount={4} gutter="1.4vw">
                    {randomImagesWithInfo.map((imageInfo, index) => (
                        <DelayLink 
                            delay={1500} 
                            onDelayStart={() => handleDelayStart(imageInfo.projectColor)}  
                            to={`/projects/${imageInfo.project.id}/${imageInfo.indexWithinProject}`} 
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

  const FastView = ({ data, filmProjectItemsRef, onHoverImage, handleDelayStart }) => {
      const [lastHoveredIndex, setLastHoveredIndex] = useState(null);
      const [currentHoveredIndex, setCurrentHoveredIndex] = useState(null);

      const infiniteScrollData = data.length < 5 ? [...data, ...data.slice(0, 5 - data.length)] : data;

      const handleHoverImage = (url, blurhash, index) => {
          onHoverImage({ url, blurhash });
          setCurrentHoveredIndex(index);
      };

      const handleMouseLeave = () => {
          setCurrentHoveredIndex(null);
      };

      useEffect(() => {
          if (currentHoveredIndex !== null && currentHoveredIndex !== lastHoveredIndex) {
              setLastHoveredIndex(currentHoveredIndex);
          }
      }, [currentHoveredIndex, lastHoveredIndex]);

      return (
          <div className={`${styles['infinite-scroll-map-wrap']} infinite-scroll-map-wrap`}>
              {infiniteScrollData.map((project, index) => (
                  <DelayLink
                      delay={1500}
                      to={`/projects/${project.id}`}
                      onDelayStart={() => handleDelayStart(project.projectColor)}
                      className={`${styles['view-list-item-link']} view-list-item-link`}
                      key={`fast-link-${project.id}-${index}`}
                  >
                      <div
                          onMouseEnter={() => handleHoverImage(project?.mainFeaturedImage?.url, project?.mainFeaturedImage?.blurhash, index)}
                          onMouseLeave={handleMouseLeave}
                          className={`${styles['infinite-film-project-item']} film-project-item infinite-film-project-item ${(lastHoveredIndex === index || currentHoveredIndex === index) ? 'hovered-project' : ''}`}
                          key={`fast-item-${project.id}-${index}`}
                      >
                          <h2 className={`title ${styles['infinite-film-title']}`}>
                              {project.displayName}
                          </h2>
                      </div>
                  </DelayLink>
              ))}
          </div>
      );
  };




export default Films;
