import React, { createRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './referencePeace.module.css';
import './referencePeace.css';
import Reveal from "../../../utils/textElementReveal/textElementReveal";
import { collection, query, getDocs, limit, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '../../../firebase/firebase';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useMousePosition from '../../../utils/useMousePosition';
import DelayLink from "../../../utils/delayLink";
import ContactBlock from "../../molecules/ContactBlock/contactBlock";

gsap.registerPlugin(ScrollTrigger);

function ReferencePeace() {
    let currentIndex = 0;
    let imageCollection = [];
    const ref = useRef(null);
    let step = 0;
    let maxImages = 2;
    let nbOfImages = 0;
    const titleWrapRef = useRef(null);
    const imageWrap = useRef(null);
    const projectListing = useRef(null);
    const [titleWrapRefHovered, setTitleWrapRefHovered] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [hoverDescHeight, setHoverDescHeight] = useState(0);
    const [prevX, setPrevX] = useState(0);
    const [prevY, setPrevY] = useState(0);
    const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
    const [currentProject, setCurrentProject] = useState(''); // Initialize with first item's focusGenre
    const [wobble, setWobble] = useState({ translateY: 0, rotate: 0 }); // State for wobble effect
    const hoverDescRef = useRef(null);
    const wobbleTimeoutRef = useRef(null); // Ref to store the timeout
    const [projectColour, setProjectColour] = useState(0);
    const imageCollectionRef = useRef([]);
    const [data, setData] = useState([]);
    const [prevHover, setPrevHover] = useState([data[0]]);

  useEffect(() => {
      let collectionName = 'referencePeace';

      let unsub = onSnapshot(collection(db, collectionName), (snapShot) => {
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
    document.title = 'Reference Peace by Max Dona';

    document.documentElement.style.setProperty('--primary-color', '#181818');
    document.documentElement.style.setProperty('--secondary-dark', 'rgb(10, 10, 10)');
    
        imageCollectionRef.current = [...Array(31).keys()].map(() => createRef());
    }, []);



  const manageMouseMove = useCallback((e) => {
      const { clientX, clientY, movementX, movementY } = e;

      step += Math.abs(movementY) + Math.abs(movementX) * 1.5;

      if (step >= 95 * currentIndex) {
          MouseMove(clientX, clientY);
          if (nbOfImages === maxImages) {
              removeImage();
          }
      }

      if (currentIndex === imageCollectionRef.current.length) {
          currentIndex = 0;
          step = -95;
      }
  }, [currentIndex, nbOfImages, maxImages, step]);


useLayoutEffect(() => {
  const handleResize = () => {
    const newWindowWidth = window.innerWidth;

    setWindowWidth(newWindowWidth);
  };

  const resizeObserver = new ResizeObserver(handleResize);
  resizeObserver.observe(document.body);

  return () => {
    resizeObserver.disconnect();
  };
}, []);

    const handleHeroMouseLeave = useCallback((e) => {
        imageCollection.forEach((imageRef) => {
            const image = imageRef.current;
            if (image) {
                image.style.transition = '500ms ease scale 0.2s, 500ms ease opacity 0.2s, clip-path 500ms ease-out';
                image.style.opacity = '0';
                image.style.scale = '0.2';
            }
        });
    });

    const handleHeroMouseEnter = useCallback((e) => {
        // Reset the active image to the first step
        if (imageCollectionRef.current[0]?.current) {
            const firstImage = imageCollectionRef.current[0].current;
            firstImage.style.transition = '500ms ease scale 0.2s, 500ms ease opacity 0.2s, clip-path 500ms ease-out';
            firstImage.style.opacity = '0';
            firstImage.style.scale = '0.2';
            firstImage.style.zIndex = '0'; // Bring it to the front
        }

        // Reset other images to their default state
        imageCollectionRef.current.forEach((imageRef) => {
            const image = imageRef.current;
            if (image && image !== imageCollectionRef.current[0].current) {
                image.style.opacity = '0';
                image.style.scale = '0.2';
                image.style.zIndex = '0'; // Send it to the back
            }
        });
    }, []);

    const removeImage = () => {
        const images = getImages();
        nbOfImages--;

        images[0].style.transition = '500ms ease scale 0.2s, 500ms ease opacity 0.2s, clip-path 500ms ease-out';
        images[0].style.opacity = '0';
        images[0].style.scale = '0.2';
    };

    const MouseMove = (x, y) => {
        const targetImage = imageCollectionRef.current[currentIndex]?.current;

        if (!targetImage) {
            console.error('Target image is null at index:', currentIndex);
            return;
        }

        const maxX = window.innerWidth - 360;
        const newX = Math.min(x, maxX);

        targetImage.style.left = `${newX}px`;
        targetImage.style.top = `${y}px`;
        targetImage.style.zIndex = '-9';
        targetImage.style.transition = '0ms opacity, 0ms scale, clip-path 500ms ease-out';
        targetImage.style.opacity = '1';
        targetImage.style.scale = '1';

        currentIndex++;
        nbOfImages++;

        resetZIndex();
    };
    
 
    

    const resetZIndex = () => {
        const images = getImages();
        images.forEach((image, i) => {
            image.style.zIndex = i;
        });
    };

    const getImages = () => {
        const images = [];
        const indexOfFirstImage = currentIndex - nbOfImages;
        for (let i = indexOfFirstImage; i < currentIndex; i++) {
            let targetIndex = i;
            if (targetIndex < 0) targetIndex += imageCollectionRef.current.length;
            images.push(imageCollectionRef.current[targetIndex].current);
        }
        return images;
    };

    useLayoutEffect(() => {
      let mm = gsap.matchMedia();
      const triggers = [];

      mm.add("(min-width: 831px)", () => {


      const desktopImageWrapTrigger = () => {
        triggers.push(ScrollTrigger.create({
        trigger: projectListing.current,
        pin: imageWrap.current,
        start: `-84px top`,
        end: () => projectListing.current.offsetHeight + window.innerHeight - (window.innerWidth * 0.14),
        scrub: true,
        })
        )
      };


      gsap.to('.reference-peace-title-wrap ', {

          scrollTrigger: {
              trigger: '.reference-peace-page',
              scrub: true,
              start: `${window.innerHeight * 0.16} top`,
              end: ()=> window.innerHeight * 1.2,
          },
          y:windowWidth * 0.08

      })

      gsap.to('.reference-peace-first-page ', {

          scrollTrigger: {
              trigger: '.reference-peace-page',
              scrub: 1,
              start: `top top`,
              end: ()=> window.innerHeight * 1.2,
          },
         scale:0.97,
          y:windowWidth * 0.04
      })

      if(projectListing.current){
        desktopImageWrapTrigger();
      }
 
    });


    mm.add("(max-width: 830px)", () => {
      

      const mobileImageWrapTrigger = () => {
        triggers.push(ScrollTrigger.create({
        trigger: projectListing.current,
        pin: imageWrap.current,
        start: `-${windowWidth * 0.04 + 100} top`,
        end: () => projectListing.current.offsetHeight + window.innerHeight,
        scrub: true,
        })
        )
      };
      
      if(projectListing.current){
      mobileImageWrapTrigger();
      }

    });

      // Cleanup function to kill only local ScrollTrigger instances
       return () => {
        triggers.forEach(trigger => trigger.kill());
        ScrollTrigger.clearMatchMedia(); // Cleanup on window size change
      };
    }, [projectListing, imageWrap, windowWidth]);

    useLayoutEffect(() => {
      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh(); // Refresh ScrollTrigger on resize
      });

      if (projectListing.current) {
        resizeObserver.observe(projectListing.current);
      }

      return () => {
        if (projectListing.current) {
          resizeObserver.unobserve(projectListing.current);
        }
      };
    }, [projectListing]);
    
 

    const handleProjectItemMouseEnter = (item, index) => {
        if (imageWrap.current) {
            gsap.to('.projects-image',{
                y: `-${((window.innerWidth * 0.22) * (index)) + (index) * 20}px`,
            })
        }
        // Update prevHover and trigger onHoverChange if different item
        if (prevHover && prevHover.id === item.id) {
          setPrevHover(item);
        } else {
          setPrevHover(item);
        }

    
        gsap.to('.projects-hover-desc .link-desc > span', {
          y: '100%',
          duration: 0.3,
          onComplete: () => {
            setCurrentProject(formatDate(item.releaseDate));
            gsap.to('.projects-hover-desc .link-desc > span', {
              y: '100%',
              color: '#000000',
              opacity: 0,
              duration: 0,
              onComplete: () => {
                gsap.to('.projects-hover-desc .link-desc > span', {
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



    const handleMouseLeave = () => {

      gsap.to('.projects-hover-desc .link-desc > span', {
      y:'100%',
      duration:0.2,

    });
    }

  

    let {x, y} = useMousePosition('.App');

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
      gsap.to('.projects-hover-desc', {
      width:document.querySelector('.projects-hover-desc .link-desc > span').clientWidth,
      duration:0,
      });
      gsap.to('.projects-hover-desc', {
      height:document.querySelector('.projects-hover-desc .link-desc > span').clientHeight,
      duration:1,
      });
    }, [currentProject]);

    return (
        <section className={`reference-peace-page ${styles['reference-peace-page']}`}>
            <div className={`reference-peace-first-page ${styles['reference-peace-first-page']}`}>
            {window.innerWidth <= 830 &&
            <img className={`mobile-RP-sticker ${styles['mobile-RP-sticker']}`} src='/animated_webp/MobileStickerRP.webp' alt='Mobile-RP-Sticker'/>
            }
            <div
                className={`reference-peace-title-wrap ${styles['reference-peace-title-wrap']}`}
                ref={titleWrapRef}
                onMouseMove={manageMouseMove}
                onMouseLeave={handleHeroMouseLeave}
                onMouseEnter={handleHeroMouseEnter}
            >
                <Reveal custom={18} element={'p'} elementClass={`reference-peace-subtitle ${styles['reference-peace-subtitle']}`} textContent={'A Creative'}/>

                <Reveal custom={18}  element={'p'} elementClass={`reference-peace-subtitle ${styles['reference-peace-subtitle']}`} textContent={'Pursuit Platform:'}/>

                <div className={`${styles['reference-peace-title']}`}>
                    <Reveal custom={18}  element={'p'} elementClass={`reference-peace-title-reference ${styles['reference-peace-title-reference']}`} textContent={'Reference'}/>
                    <Reveal custom={18}  element={'p'} elementClass={`reference-peace-title-peace ${styles['reference-peace-title-peace']}`} textContent={'peace'}/>

                </div>
            </div>
            <div className='reference-peace-subtext-wrap high-z-index-layer'>
                <div className={`reference-peace-subtext ${styles['reference-peace-subtext']} subtext-top body`}>
                  
                    <Reveal elementClass={'high-z-index-layer'}  textContent={'MULTI'} element={"p"}/>
                    <Reveal  textContent={'MEDIA'} element={"p"}/>
                    <Reveal  textContent={'MAGAZINE'} element={"p"}/>

                </div>
                <div className={`reference-peace-subtext ${styles['reference-peace-subtext']} subtext-bottom body`}>
                    <div className={`body scroll-notification ${styles['scroll-notification']}`}>
                        <p>
                        (<p>SCROLL</p>)
                        </p>
                    </div>
                </div>
            </div>
            </div>
            <div className={`reference-peace-projects-wrap ${styles['reference-peace-projects-wrap']}`}>
                <div className={`subtext-description-wrap ${styles['subtext-description-wrap']}`}>
                    <p className='body high-z-index-layer'>
                        <p>*</p><br/>
                        <Reveal  textContent={'Pursuing the understanding of creative minds through documenting their expression, Reference Peace allows you to connect with the artists behind exclusive works, learning about their influences, inspirations & intentions.'} element={"p"}/>
                      
                    </p>
                    <p className={`${styles['last-subtext']} body high-z-index-layer`}>
                        <p>*</p><br/>
                        <Reveal  textContent={'LEARNING & COLLABORATING TOGETHER, Time stamping the current creative climate, ONE VOLUME AT A TIME.'} element={"p"}/>
                    </p>
                </div>
            
                <div ref={projectListing} className={`projects-listing  ${styles['projects-listing']}`}> 
                <div ref={imageWrap} className={`projects-image-wrap ${styles['projects-image-wrap']}`} >
                    {window.innerWidth <= 830 ?
                    <span className='body'>Tap volume to open</span>
                  :
                  data.map((project, index) => (
                      <div className={`projects-image ${styles['projects-image']}`}>
                        <DelayLink delay={1500} to={`/reference-peace/${project.id}`}>
                        <ParallaxImage  imageUrl={project.mainFeaturedImage} projectName={project.id}></ParallaxImage>
                        </DelayLink>
                          
                      </div>
                  ))
                  }

                    
                   
               
                </div>
                <div  className={`projects-links-list high-z-index-layer ${styles['projects-links-list']}`} onMouseLeave={handleMouseLeave}> 
                <div
                      className={`projects-hover-desc`}
                      ref={hoverDescRef}
                      style={{
                        position: "fixed",
                        left: `${x - 16}px`,
                        top: `${y - 20}px`,
                        transform: `translateY(${wobble.translateY}px) rotate(${wobble.rotate}deg)`,
                      }}
                    >
                      <div className="projects-hover-svg-wrap">
                        <svg width="17" height="25" viewBox="0 0 17 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="projects-hover-arrow">
                        <path style={{ fill: `${projectColour}` }} fill-rule="evenodd" clip-rule="evenodd" d="M2.0078 4.99998H0.29C0.193334 4.99998 0 4.95453 0 4.77271V0.22727C0 0 0.348 0 0.580001 0H1.74023H6.38H6.38086H8.12023H11.2382H12.1809H16.2405V4.63965V6.37983V10.4395V10.4473H16.2435V16.2471C16.2435 16.4791 16.2435 16.8271 16.0053 16.8271H11.2411C11.0506 16.8271 11.0029 16.6338 11.0029 16.5371V10.7739C11.0009 10.7578 11 10.7427 11 10.7295V8.99603L6.39529 13.6006L6.39552 13.6008L3.92365 16.0726C3.82477 16.1715 3.67646 16.3198 3.50954 16.1529L0.171188 12.8146C0.037654 12.6811 0.0866662 12.5653 0.127864 12.5241L1.48753 11.1645L1.4873 11.1642L7.65128 5.00047H2.03023C2.02257 5.00047 2.01509 5.0003 2.0078 4.99998Z" fill="#181818"/>
                        </svg>
                      </div>

                      <p className={`body link-desc`}>
                        <span dangerouslySetInnerHTML={{ __html: currentProject }}></span>
                      </p>
                    </div>
                    {data.map((project, index) => (
                    <div className="reference-peace-project-item" key={project.id}>
                    
                        <DelayLink delay={1500} to={`/reference-peace/${project.id}`} onMouseEnter={() => handleProjectItemMouseEnter(project, index)} className={`view-project-link title ${styles['view-project-link']}`}><Reveal elementClass='title' textContent={project.displayName} element={'h2'}/></DelayLink>
                    </div>
                    ))}
                   </div>
                    </div>
            </div>
            {window.innerWidth > 830 &&
            <div className='images-wrap'>
                {[...Array(31).keys()].map((index) => {
                    const imageRef = imageCollectionRef.current[index];

                    return (
                        <img
                            ref={imageRef}
                            className={`image-trail-${index} ${styles['trail-image']} trail-image`}
                            key={index}
                            src={`/imagery/referencepeace/${index}.webp`}
                        />
                    );
                })}
            </div>
            }
            


            <div className='reference-peace-contact-block'>
                <ContactBlock referencePeace={true}/>
            </div>
            

        </section>
    );
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  // Get the day of the month
  const day = date.getDate();

  // Determine the appropriate suffix
  let suffix = 'th';
  if (day % 10 === 1 && day !== 11) suffix = 'st';
  else if (day % 10 === 2 && day !== 12) suffix = 'nd';
  else if (day % 10 === 3 && day !== 13) suffix = 'rd';

  // Format the date
  const options = { month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

  // Return the formatted date with the suffix
  return `${day}<span>${suffix}</span> ${formattedDate}`;
};


const ParallaxImage = ({ imageUrl, projectName }) => {
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
      <div className={`${styles['parallax-button']}`}>
          <p className="primary-button">Full Volume</p>
      </div>
    </div>
  );
};

export default ReferencePeace;
