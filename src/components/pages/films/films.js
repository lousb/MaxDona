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

gsap.registerPlugin(ScrollTrigger);

function Films() {
    const { dispatch } = useFooter();
    const [data, setData] = useState([]);
    const filmProjectItemsRef = useRef([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeView, setActiveView] = useState('slow'); // State to manage active view
    const [hoveredImage, setHoveredImage] = useState(null);

    const handleHoveredImageChange = (imageUrl) => {
        setHoveredImage(imageUrl)
    };

    // Function to toggle between views
    const handleViewChange = (view) => {
        setActiveView(view);
    };

    useEffect(() => {
        // Update the footer state when the component is mounted
        dispatch({ type: "Small" });

        // Clean up the state when the component is unmounted
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
            console.log(error);
        });

        return () => {
            unsub();
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, scrollPosition);
    }, [activeView]);

    const debounce = (func, delay) => {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };


    let location = useLocation();

    useEffect(() => {
        gsap.fromTo(".App", { opacity: 0 }, { opacity: 1, duration:1 });
        gsap.fromTo(".project-scroll-height", { height:'0px' }, { height: '100%', duration: 1, ease:[0.76, 0, 0.24, 1], delay:1});
        
    }, [location]);

    const slowViewAnimations = (handleScroll, handleScrollDebounced) => {
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('scroll', handleScrollDebounced);

        const filmProjectItems = document.querySelectorAll('.film-project-item');

        if (data.length > 0) {
            const itemHeight = window.innerHeight * 0.8 - 90;
            const totalHeight = (data.length - 1) * itemHeight; // Total distance to cover
            const maxTranslateY = (data.length - 1) * 100 - 20.8; // Maximum translateY needed

            

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
        }

       
        
        gsap.fromTo('.film-project-scroll-container',{
            height: 'calc(70svh - 90px)',
        },{
    
          height: 'calc(100svh - 4vw - 90px)',
          scrollTrigger: {
            trigger:'.page-content', 
            start: 'top top',
            end: '600',
            scrub: true,
            id: "scrub",
          },
        });

        gsap.fromTo('.film-project-item',{
          height: 'calc(70svh - 90px)'
        },{
    
            height: 'calc(80svh - 90px)',
          scrollTrigger: {
            trigger:'.page-content', 
            start: 'top top',
            end: '200',
            scrub: true,
            id: "scrub",
          },
        });

        gsap.fromTo('.film-page-title-wrap',{
            y: '90px'
          },{
      
              y: '0px',
             
            scrollTrigger: {
              trigger:'.film-page-wrap', 
              start: 'top top',
              end: '500',
              scrub: true,
              id: "scrub",
            },
          });

    };

    const mediumViewAnimations = () => {
        gsap.fromTo('.random-masonry-image-view',{
            marginTop: '10vw'
        },{
            marginTop: '0px',
            scrollTrigger: {
                trigger:'.film-page-wrap', 
                start: 'top top',
                end: '1000',
                scrub: true,
                id: "scrub",
            },
        });

    };

    const fastViewAnimations = () => {


    

   

        gsap.fromTo('.infinite-scroll-map-wrap',{
            marginTop: '10vw'
        },{
            marginTop: '0px',
            scrollTrigger: {
                trigger:'.film-page-wrap', 
                start: 'top top',
                end: '1000',
                scrub: true,
                id: "scrub",
            },
        });

    };


    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
        };

        const handleScrollDebounced = debounce(() => {
            setScrollPosition(window.pageYOffset || document.documentElement.scrollTop);
        }, 100); // Adjust the delay as needed

        switch (activeView) {
            case 'slow':
                slowViewAnimations();
                break;
            case 'medium':
                mediumViewAnimations();
                break;
            case 'fast':
                fastViewAnimations();
                break;
            default:
                // Handle default view animations
                break;
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScrollDebounced);
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [data, activeView]);

    return (
        <div className="fufu">
       {window.innerWidth > 830 && <MouseCursor/>}
        <div className={`${styles['film-page-wrap']} film-page-wrap ${activeView === 'fast' && 'fast-active'}`}>
                
            <AnimatePresence>
                {activeView === 'fast'&&
                    <motion.div
                        initial={{ opacity: 0,}}
                        animate={{ opacity: 1, transition:{ delay:1, duration: 0.8, ease:[0.76, 0, 0.24, 1] }}}
                        exit={{ opacity: 0}}
                        transition={{ duration: 0.8, ease:[0.76, 0, 0.24, 1] }}
                    
                    className={`${styles['floating-project-thumb-wrap']} floating-project-thumb-wrap`}>
                        <div>
                            <ParallaxImage imageUrl={hoveredImage || '/Max-Headshot.png'} className={`${styles['floating-project-image']} floating-project-image`}/>
                            <div className={`body ${styles['floating-project-name']} floating-project-name`}></div>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
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
                        <SlowView data={data} filmProjectItemsRef={filmProjectItemsRef} />
                    </motion.div>
                )}
               
                {activeView === 'fast' && (
                    <motion.div
                        className={`${styles['project-wrap']} project-wrap`}
                        key="fast"
                        initial={{ opacity: 0, y:'20%' }}
                        animate={{ opacity: 1, y:'0%', transition: { duration: 1, delay: 0.4, ease:[0.76, 0, 0.24, 1] } }}
                        exit={{ opacity: 0, y:'20%' }}
                        transition={{ duration: 0.8, ease:[0.76, 0, 0.24, 1] }}
                        
                    >
                        <FastView data={data} filmProjectItemsRef={filmProjectItemsRef}  onHoverImage={handleHoveredImageChange}/>
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
                        <MediumView data={data} filmProjectItemsRef={filmProjectItemsRef}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        </div>
        </div>
    );
}

const SlowView = ({ data, filmProjectItemsRef }) => {

    return (
        <div className={`slow-view ${styles['film-project-scroll-wrap']}`}>
        <div className={`body film-project-scroll-container ${styles['film-project-scroll-container']}`}>
            <div className={`project-scroll-height ${styles['project-scroll-height']}`}>
            {data.map((project, index) => (
                <Link to={`/projects/${project.id}`} className={`view-list-item-link ${styles['view-list-item-link']}` }key={project.id}>
                    <div
                        style={{backgroundImage : `url(${project.mainFeaturedImage})`}}
                        ref={(el) => (filmProjectItemsRef.current[index] = el)}
                        className={`${styles['film-project-item']} film-project-item`
                      
                    }
                    >
                        {index === 0?
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
                        :

                        <>
                            <h2 className={`header-reduced ${styles['film-project-title']} ${styles['film-project-desc-item']}`}>
                            <Reveal custom={0} textContent={project.displayName} element={"span"} elementClass={`heading`}/>
                            </h2>
                            <h3 className={`body ${styles['film-project-director']} ${styles['film-project-desc-item']}`} >
                                <Reveal custom={1} textContent={"Directed by Max Dona"} element={'p'} elementClass={"body"}/>
                            </h3>
                            <div className={`body ${styles['film-project-video-name']} ${styles['film-project-desc-item']}`} >
                                <Reveal custom={2} textContent={`${project.videoName} (${new Date(project.releaseDate).getFullYear()})`} element={'p'} elementClass={"body"}/>
                            </div>
                            <div className={`primary-button ${styles['film-project-cta']} ${styles['film-project-desc-item']}`} >
                                <Reveal custom={3} textContent={`FULL PROJECT HERE`} element={'p'} elementClass={`primary-button ${styles['film-project-cta']} ${styles['film-project-desc-item']}`}/>

                            </div>
                        </>
                        
                        }
                        
                        
                    </div>
                </Link>
            ))}
            </div>
        </div>
        </div>
    );
};


const MediumView = ({ data }) => {
    const [randomImagesWithInfo, setRandomImagesWithInfo] = useState([]);

    useEffect(() => {
        const fetchRandomImages = async () => {
            const allImageUrls = new Set();

            // Extract all image URLs from different folders (image1, image2, etc.)
            data.forEach((project) => {
                for (let i = 1; i <= 3; i++) {
                    const imageUrls = project.imageUrls[`image${i}`];
                    if (imageUrls && Array.isArray(imageUrls)) {
                        imageUrls.forEach((url) => allImageUrls.add(url));
                    }
                }
            });

            const uniqueImageUrls = Array.from(allImageUrls);

            // Shuffle the array to randomize the images
            const shuffledImages = shuffleArray(uniqueImageUrls);

            // Get the first 20 (or desired number) images for display
            const randomImageUrls = shuffledImages.slice(0, 25);

            const imagesWithInfo = randomImageUrls.map((imageUrl) => {
                const project = data.find((project) =>
                    Object.values(project.imageUrls).flat().includes(imageUrl)
                );

                const indexWithinProject = Object.values(project.imageUrls)
                    .map((images) => images.indexOf(imageUrl))
                    .find((index) => index !== -1);

                return { imageUrl, project, indexWithinProject };
            });

            setRandomImagesWithInfo(imagesWithInfo);
        };

        fetchRandomImages();
    }, [data]);

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
              end: ()=>`+=${tallestColumnHeight - (window.innerHeight/2.5)}`,
              markers: true,
              scrub: true,
            },
          });
        });
      } else {
        console.log('No masonry section found.');
      }
    }, 1000); // Adjust the delay as needed
  }, [randomImagesWithInfo]); 

    return (
        <div className={`${styles['random-masonry-image-view']} random-masonry-image-view`}>
       

            <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 500: 2, 700: 3, 900: 4 }}>
                 <Masonry columnsCount={4} gutter="1.4vw">
                    {randomImagesWithInfo.map((imageInfo, index) => (
                 
                 <Link to={`/projects/${imageInfo.project.id}/${imageInfo.indexWithinProject}`} key={index}>
                    <ParallaxImage key={index} imageUrl={imageInfo.imageUrl} className={`${styles['random-masonry-image']}`} />
                </Link>
              
            ))}
              </Masonry>
            </ResponsiveMasonry>
            
        </div>
    );
};


const ParallaxImage = ({ imageUrl }) => {
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

  const FastView = ({ data, filmProjectItemsRef, onHoverImage }) => {
    const infiniteScrollData = [...data];

    if (infiniteScrollData.length < 5) {
        infiniteScrollData.push(...data.slice(0, 5 - infiniteScrollData.length));
    }

    const [lastHoveredIndex, setLastHoveredIndex] = useState(null); // Store the last hovered index
    const [currentHoveredIndex, setCurrentHoveredIndex] = useState(0); // Store the currently hovered index

    const handleHoverImage = (imageUrl, index) => {
        onHoverImage(imageUrl);
        setCurrentHoveredIndex(index); // Update the currently hovered index
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
                <Link to={`/projects/${project.id}`} className={`${styles['view-list-item-link']} view-list-item-link`} key={project.id}>
                    <div
                        key={index}
                        onMouseEnter={() => handleHoverImage(project.mainFeaturedImage, index)}
                        onMouseLeave={handleMouseLeave}
                        className={`${styles['infinite-film-project-item']} film-project-item infinite-film-project-item ${(lastHoveredIndex === index || currentHoveredIndex === index) ? 'hovered-project' : ''}`}
                    >
                        <h2 className={`title ${styles['infinite-film-title']}`}>
                            {project.displayName}
                        </h2>
                    </div>
                </Link>
            ))}
            {infiniteScrollData.map((project, index) => (
                <Link to={`/projects/${project.id}`} className={`${styles['view-list-item-link']} view-list-item-link`} key={project.id}>
                    <div
                        key={index}
                        onMouseEnter={() => handleHoverImage(project.mainFeaturedImage, index)}
                        onMouseLeave={handleMouseLeave}
                        className={`${styles['infinite-film-project-item']} film-project-item infinite-film-project-item ${(lastHoveredIndex === index || currentHoveredIndex === index) ? 'hovered-project' : ''}`}
                    >
                        <h2 className={`title ${styles['infinite-film-title']}`}>
                            {project.displayName}
                        </h2>
                    </div>
                </Link>
            ))}
        </div>
    );
};


export default Films;
