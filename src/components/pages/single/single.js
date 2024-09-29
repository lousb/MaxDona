import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import styles from './single.module.css';
import { useParams ,useNavigate, useLocation} from 'react-router-dom';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { getImageUrlByIndex, getTotalImageCount } from './helpers';
import SingleImageView from '../image/image';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";

import Reveal from '../../../utils/textElementReveal/textElementReveal';
import YouTube from 'react-youtube';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from 'react-router-dom';
import './single.css'
import DelayLink from '../../../utils/delayLink';
import useMousePosition from '../../../utils/useMousePosition';


gsap.registerPlugin(ScrollTrigger);

const Single = () => {
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollPositionRef = useRef(0);
  const sectionRef = useRef(null);
  const masonrySection = useRef(null);
  const [projectList, setProjectList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  const [prevX, setPrevX] = useState(0);
  const [prevY, setPrevY] = useState(0);
  const [velocity, setVelocity] = useState({ vx: 0, vy: 0 });
  const [currentProject, setCurrentProject] = useState(''); // Initialize with first item's focusGenre
  const [wobble, setWobble] = useState({ translateY: 0, rotate: 0 }); // State for wobble effect
  const hoverDescRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [copyLinkDesc, setCopyLinkDesc] = useState('Play Video');

  const wobbleTimeoutRef = useRef(null); // Ref to store the timeout


  let {x, y} = useMousePosition('.App');


  const handleProjectItemMouseEnter = () => {
    setIsHovered(true);

    gsap.to('.video-hover-desc .link-desc > span', {
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



  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, []); 

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

  useEffect(() => {
    if (projectData && projectData.displayName && projectData.projectColor) {
      document.title = `${projectData.displayName} by Max Dona`;

      document.documentElement.style.setProperty('--primary-color', projectData.projectColor);
      document.documentElement.style.setProperty('--secondary-dark', projectData.projectColor);
    }
  }, [projectData]);



  useEffect(() => {
    if(projectData){
      gsap.fromTo(".main-section-image", { height:'0px' }, { height: '100%', duration: 1, ease:[0.76, 0, 0.24, 1], delay:0.5});

    }
      
  }, [projectData]);

 useLayoutEffect(() => {
   let pinScrollTrigger, pinScrollControlsTrigger;
   let mm = gsap.matchMedia();

   mm.add("(min-width: 831px)", () => {

   const pinVideoSection = () => {
     pinScrollTrigger = ScrollTrigger.create({
       trigger: '.project-page-section-1',
       start: 'top top',
       end: () => sectionRef.current.clientHeight * 1.5,
       pin: `.${styles['main-section-image-wrap']}`,
     });
   };

   const pinVideoControls = () => {
     pinScrollControlsTrigger = ScrollTrigger.create({
       trigger: '',
       start: 'top top',
       end: () => sectionRef.current.clientHeight * 1.5,
       pin: `.${styles['main-video-controls-overlay']}`,
     });
   };

   const setupAnimations = () => {
     const mainSectionDetails = document.querySelector(`.${styles['main-section-details']}`);
     const mainSectionImage = document.querySelector(`.${styles['main-section-image']}`);
     const projectPageSection1 = document.querySelector(`.${styles['project-page-section-1']}`);
    const rightWrap = document.querySelector(`.${styles['main-description-right-wrap']}`);


     if (mainSectionDetails) {
       gsap.fromTo(mainSectionDetails, {
         clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
       },{
         clipPath: 'polygon(0 0, 1% 0, 1% 100%, 0 100%)',
         scrollTrigger: {
           start: '00px',
           end: () => sectionRef.current.clientHeight / 0.75,
           scrub: 1.5,
           id: 'scrub',
           trigger: sectionRef.current,
         },
       });
     }
    


     if (mainSectionImage) {
       gsap.to(mainSectionImage, {
         width: '100%',
         scrollTrigger: {
           start: '100px',
           end: () => sectionRef.current.clientHeight / 0.75,
           scrub: 1.5,
           id: 'scrub',
           trigger: sectionRef.current,
         },
       });
     }


      

     

     if (projectPageSection1) {
       gsap.to(projectPageSection1, {
         marginBottom: 'calc(150vh - 2.4vw)',
         scrollTrigger: {
           start: '100vh',
           end: '150vh',
           scrub: 2,
           id: 'scrub',
           trigger: sectionRef.current,
         },
       });
     }

     if(rightWrap){
       gsap.fromTo(rightWrap,{
          y: '0px',
        }, {

         y: '-42px',
         scrollTrigger: {
           start: '00px',
           end:()=> '84px',
           scrub: true,
           id: 'scrub',
           trigger: sectionRef.current,
         },
       });
     }

 

     pinVideoSection();
     pinVideoControls();
   };
   setupAnimations();
  });

 

   return () => {
     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
   };
 }, [sectionRef]);
  
 useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('.main-description-right-wrap');
      if (element) {
        if (window.scrollY > 190) {
          element.querySelectorAll('span').forEach(child => {
            child.style.color = 'white';
          })
        } else {
          element.querySelectorAll('span').forEach(child => {
            child.style.color = 'var(--primary-color)';
          })
        }
      }

    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

useEffect(() => {
  const fetchProjectDataAndList = async () => {
    try {
      // Fetching project data
      const projectDoc = doc(db, 'projects', projectId);
      const projectSnapshot = await getDoc(projectDoc);

      if (projectSnapshot.exists()) {
        const data = projectSnapshot.data();
        setProjectData(data);
        console.log(data);
      } else {
        console.error('Project not found.');
      }

      // Fetching project list
      const projectListQuery = query(collection(db, 'projects'), orderBy('displayName'));
      const projectListSnapshot = await getDocs(projectListQuery);
      const projectListData = projectListSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjectList(projectListData);

    } catch (error) {
      console.error('Error fetching project data or list:', error);
    }
  };

  fetchProjectDataAndList();
}, [projectId]);
  

useEffect(() => {
  if (projectList.length > 0 && projectId) {
    const index = projectList.findIndex(project => project.id === projectId);
    if (index !== -1) {
      setCurrentIndex(index);
    } else {
      console.error('Project ID not found in projectList.');
      setCurrentIndex(0); // or handle as needed
    }
  }
}, [projectList, projectId]);


  const handleImageClick = (groupIndex, imageIndex) => {

    let clickedIndex = 0;
    for (let i = 0; i < groupIndex; i++) {
      if (projectData?.imageUrls[`image${i + 1}`]) {
        clickedIndex += projectData.imageUrls[`image${i + 1}`].length;
      }
    }
    clickedIndex += imageIndex;
  
    // Log the click
    console.log(`Image clicked - Group Index: ${groupIndex}, Image Index: ${imageIndex}, Total Index: ${clickedIndex}`);
  
    // Store the current scroll position
    scrollPositionRef.current = window.scrollY;
  
    setSelectedImageIndex(clickedIndex);

  
  };
  
  useEffect(()=>{
    gsap.to('.video-hover-desc', {
    width:document.querySelector('.video-hover-desc .link-desc > span').clientWidth,
    duration:0,
    });

  }, [copyLinkDesc]);
  
  
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState('00:00');
  const [isPlayingProp, setIsPlayingProp] = useState(false);


const renderSection = (section, index) => {
  switch (section.name) {
    case 'detail':
      return (
        <DetailsSection
          key={`detail-${index - 1}`}
          index={index - 1}
          value={projectData?.details?.[`${section.index}`]}
        />

      );
    case 'image':
      return (
        <ImageSection
          key={`image-${index}`}
          groupKey={`image-${index}`}
          groupImages={projectData.imageUrls[`image${section.index}`]}
          groupIndex={index}
          handleImageClick={handleImageClick}
          projectData={projectData}
        />
      );
    case 'text':
      return (
        <TextSection
          key={`text-${index}`}
          value={projectData?.textSections[`text${section.index}`]}

        />
      );
    case 'title':
      return (
        <TitleSection
          key={`title-${index}`}
          value={projectData?.titleSections[`title${section.index}`]}
        />
  
      );
    case 'largeImage':
      const largeImageArray = projectData.largeImageSections[section.index];
      return (
        <LargeImageSection
          key={`largeImage-${index}`}
          sectionKey={`largeImage-${index}`}
          value={largeImageArray ? largeImageArray[0] : null}
        />
      );
    default:
      return null;
  }
};
 

  return (
    <div className={`${styles['project-page']} project-page`}>
      <div
        className={`video-hover-desc`}
        ref={hoverDescRef}
        style={{
          position: "fixed",
          left: `${x - 14}px`,
          top: `${y - 22}px`,
          transform: `translateY(${wobble.translateY}px) rotate(${wobble.rotate}deg)`,
        }}

      >
        <div className="video-hover-svg-wrap">
          <svg width="17" height="25" viewBox="0 0 17 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="video-hover-arrow">
          <path  fill-rule="evenodd" clip-rule="evenodd" d="M2.0078 4.99998H0.29C0.193334 4.99998 0 4.95453 0 4.77271V0.22727C0 0 0.348 0 0.580001 0H1.74023H6.38H6.38086H8.12023H11.2382H12.1809H16.2405V4.63965V6.37983V10.4395V10.4473H16.2435V16.2471C16.2435 16.4791 16.2435 16.8271 16.0053 16.8271H11.2411C11.0506 16.8271 11.0029 16.6338 11.0029 16.5371V10.7739C11.0009 10.7578 11 10.7427 11 10.7295V8.99603L6.39529 13.6006L6.39552 13.6008L3.92365 16.0726C3.82477 16.1715 3.67646 16.3198 3.50954 16.1529L0.171188 12.8146C0.037654 12.6811 0.0866662 12.5653 0.127864 12.5241L1.48753 11.1645L1.4873 11.1642L7.65128 5.00047H2.03023C2.02257 5.00047 2.01509 5.0003 2.0078 4.99998Z" fill="#181818"/>
          </svg>
        </div>

        <p className={`body link-desc`}>

          <span>{copyLinkDesc}</span>
        </p>
      </div>

      {windowWidth > 830 &&
        
            <div className={`main-video-controls-overlay ${styles['main-video-controls-overlay']}`}>
             
              <div className={`body main-description-time-wrap ${styles['main-description-time-wrap']}`} onClick={()=>   windowWidth > 830 && scrollToPercentageOfViewportHeight(140)}>
                ({videoCurrentTime})
              </div>

            <div className={`body main-description-right-wrap ${styles['main-description-right-wrap']}`} onClick={()=>   windowWidth > 830 && scrollToPercentageOfViewportHeight(140)}>
              <span>{projectData ? projectData.videoName : ''} {projectData ?`( ${ new Date(projectData.releaseDate).getFullYear()} )`  : ''}</span>
              <span className='primary-button'>
              Full Video
              </span>
            </div>
          <div className={`body scroll-notification scroll-notification-single ${styles['scroll-notification']}`} onClick={()=>windowWidth > 830 && scrollToPercentageOfViewportHeight(140)}>
            <p>
              (<div><span>SCROLL</span></div>)
            </p>
            <p className={`body single-click-anywhere`}>
              Click Anywhere To 
              <p className={`play-text ${ isPlayingProp ? 'play-text-toggle':''}`}>
                <p>play</p>
                <p>pause</p>
              </p> 
            </p>

          </div>
          <div className={`${styles['progress-bar']} ${ isPlayingProp ? '':'stop-progress-toggle'} progress-bar`}>
              <div className={`${styles['progress']}  `} style={{ width: `${videoProgress}%` }}></div>
          </div>
        </div>
      }
     
      <div>
            <section className={`${styles['project-page-section-1']} project-page-section-1`} ref={sectionRef}>
              <div className={`${styles['main-section-details']} main-section-details high-z-index-layer`}>
                {projectData ? (
                  <div className={`${styles['main-description']} main-description`}>
                    <span className={`${styles['main-single-heading']} main-single-heading`}>
                      <Reveal textContent={projectData.displayName} element={"h1"} elementClass={`heading`}/>
                    </span>
                    <span>
                      <Reveal custom={2} textContent={'Directed by Max Dona'} element={"h2"} elementClass={`body ${styles['directed-subtext']}`}/>
                    </span>
                    <div className={`${styles['main-description-wrap']}`}>
                    <div className={`${styles['main-description-wrap-left']}`}>
                      <span>
                        <Reveal custom={3} textContent={projectData.mainDescription1} element={"div"} elementClass={`body ${styles['main-description-1']}`}/>
                      </span>
                      <span>
                        <Reveal custom={3} textContent={projectData.mainDescription2} element={"div"} elementClass={`body ${styles['main-description-2']}`}/>
                      </span>
                    </div>
                    </div>
                  </div>
                  
                ) : (
                  <p>Loading project data...</p>
                )}
              </div>
              
            </section>
            <div className={`${styles['main-section-image-wrap']} main-section-image-wrap`} onMouseEnter={handleProjectItemMouseEnter}
            onMouseLeave={handleMouseLeave}>
                <div className={`${styles['main-section-image']} main-section-image`}>
                <div
                  className={`${styles['main-section-image-overlay']} main-section-image-overlay`}
                  // key={mainImageLoaded ? projectData?.mainFeaturedImage?.url : projectData?.mainFeaturedImage?.blurhash}
                  style={{
                    backgroundImage: `url(${projectData?.mainFeaturedImage?.blurhash})`,
                    filter: `${mainImageLoaded ? 'blur(0px)' : 'blur(10px)'}`,
                    transform: `scale(${mainImageLoaded ? '1' : '1.1'})`,  // Use 'transform' for scaling
                  }}
                >
                  <img
                    src={projectData?.mainFeaturedImage?.url}
                    alt="main featured"
                  
                    onLoad={() => {
                      setMainImageLoaded(true);
                    }}
                     loading='lazy'
                  />

                </div>
                  <div className={styles['video-container']}>
                    <div className={`player__wrapper ${styles['player__wrapper']} ${isPlayingProp ? 'playing-video':''}`}>
                      <CustomYouTubePlayer setVideoProgress={setVideoProgress} setVideoCurrentTime={setVideoCurrentTime} setCopyLinkDesc={setCopyLinkDesc} setIsPlayingProp={setIsPlayingProp} videoUrl={projectData?.videoLink} windowWidth={windowWidth}/>

                    </div>
                  </div> 
                </div>
                
              </div>

            
            <section>

          {projectData && (
                  <>
                    {projectData.sectionOrder.map((section, index) => renderSection(section, index))}
                  </>
                )}
            </section>
        {projectData && (
          <NavigationSection
            currentIndex={currentIndex}
            projectList={projectList}
            currentProject={projectData.displayName}
          />
        )}
      </div>
    </div>
  );
};

export default Single;


const ImageSection = ({ groupKey, groupImages, groupIndex, handleImageClick, projectData }) => {
  const { projectId } = useParams();

  const calculateTotalIndex = (groupIndex, imageIndex, projectData) => {
    let totalIndex = 0;

    // Ensure projectData.imageUrls exists and is correctly structured
    if (projectData?.imageUrls) {
      // Loop through all groups before the current one to calculate the total number of images
      for (let i = 0; i < groupIndex; i++) {
        const groupImages = projectData.imageUrls[`image${i + 1}`];  // Ensure proper group indexing
        if (groupImages && Array.isArray(groupImages)) {
          totalIndex += groupImages.length;
        }
      }
    }

    // Add the current imageIndex to the accumulated total from previous sections
    return totalIndex + imageIndex;  // +1 so that first image starts at 1, not 0
  };
  
  

  const handleImagesLoaded = (masonrySection) => {
    ScrollTrigger.refresh(true); // Refresh only for this section

    Array.from(masonrySection.children).forEach((child, i) => {
      child.classList.add(`column-${i + 1}`, 'masonry-column');
    });

    const calculateTallestColumnHeight = () => {
      let tallestHeight = 0;
      masonrySection.querySelectorAll('.masonry-column').forEach((column) => {
        const height = column.offsetHeight;
        if (height > tallestHeight) {
          tallestHeight = height;
        }
      });
      return tallestHeight;
    };

    const tallestColumnHeight = calculateTallestColumnHeight();
    masonrySection.querySelectorAll('.masonry-column').forEach((column) => {
      const columnHeight = column.offsetHeight;
      const difference = tallestColumnHeight - columnHeight;

      gsap.to(column, {
        marginTop: difference,
        scrollTrigger: {
          trigger: masonrySection,
          start: "top top", // Start when top of masonrySection reaches bottom of viewport
          end: `+=${tallestColumnHeight - window.innerHeight / 2.5}`,
          scrub: 1,
        },
      });
    });
  };

  useEffect(() => {
    const waitForImages = (images) => {
      return new Promise((resolve) => {
        let loadedCount = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
          resolve(); // Resolve immediately if no images are provided
          return;
        }

        const onLoad = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve();
          }
        };

        const onError = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve();
          }
        };

        images.forEach((image) => {
          if (image.complete) {
            onLoad(); // Call onLoad immediately if the image is already loaded
          } else {
            image.addEventListener('load', onLoad);
            image.addEventListener('error', onError);
          }
        });

        // Fallback in case images don't finish loading after a longer period
        setTimeout(() => resolve(), 10000); // 10 seconds fallback
      });
    };
    

    const refreshUntilStable = async (maxAttempts = 3) => {
      let attempt = 0;
      const images = document.querySelectorAll(`.${styles['masonry-section']} img.masonry-blurhash`);

      while (attempt < maxAttempts) {
        await waitForImages(images);
        const masonrySection = document.querySelector(`.${styles['masonry-section']}.${groupKey} > div > div`);

        if (masonrySection && masonrySection.children.length > 0) {
          handleImagesLoaded(masonrySection);
          return;
        } else {
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
      }

      // Final fallback
      const masonrySection = document.querySelector(`.${styles['masonry-section']}.${groupKey} > div > div`);
      handleImagesLoaded(masonrySection);
    };

    refreshUntilStable();

    // Cleanup event listeners
    return () => {
      const images = document.querySelectorAll(`.${styles['masonry-section']} img`);
      images.forEach((image) => {
        image.removeEventListener('load', handleImagesLoaded);
        image.removeEventListener('error', handleImagesLoaded);
      });
    };
  }, [groupKey, projectData]); // Ensure dependency array includes dynamic parts

  return (
    <div className={`masonry-section ${styles['masonry-section']} ${groupKey}`} key={groupKey}>
      <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 500: 2, 700: 3, 1200: 4 }}>
        <Masonry columnsCount={4} gutter="1.4vw">
          {groupImages.map((imageUrl, index) => {
            const totalIndex = calculateTotalIndex(groupIndex, index, projectData);
            return (
              <Link to={`/projects/${projectId}/${imageUrl.id}`} key={index}>
                <div className="column">
                  <ParallaxImage key={index} imageUrl={imageUrl.url} blurhashUrl={imageUrl.blurhash} />
                </div>
              </Link>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};



const ParallaxImage = ({ imageUrl, blurhashUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const blurhashImageRef = useRef(null);



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
      className={`${styles['parallax-image-wrap']} ${isHovered ? styles['hover'] : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={blurhashImageRef}
        src={blurhashUrl}
        alt="Parallax Image"
        className={`${styles['masonry-image']} masonry-blurhash`}
      />
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Parallax Image"
        className={`${styles['masonry-image']} ${styles['masonry-main-image']}`}
        loading="lazy"
        style={{
          transform: `translate(${maskPosition.x}px, ${maskPosition.y}px) scale(1.1)`,

        }}
      />
    </div>
  );
};



  
  
  
 
 


const DetailsSection = ({ sectionKey, value, index }) => {
  // Always call useState at the top level
  const [imageLoaded, setImageLoaded] = useState(false);

  // Return early if value is not provided
  if (!value) {
    return <p>No details available</p>; // Placeholder if no value is provided
  }

  const { firstDescription, secondDescription, title, featuredImage } = value;
  const oddSection = index % 2 !== 0; // Check if it's an odd section based on the index

  return (
    <div key={sectionKey} className={`${styles['details-section']}  ${oddSection ? styles['details-section-wrap-reversed'] : ''}`}>
      <div className={styles['details-section-image-wrap']}>
      <div
          className={styles['details-section-image']}
          style={{
            backgroundImage: `url(${featuredImage?.blurhash})`,
            filter:  `${imageLoaded ?'blur(0px)':'blur(10px)'}`, scale:  `${imageLoaded ?'1':'1.1'}`
          }}
        >
          {/* Preload the actual image to detect when it has loaded */}
          <img
            src={featuredImage?.url}
            alt="detail featured"
            onLoad={() => setImageLoaded(true)}
            loading='lazy'
          />
        </div>

      </div>
      
      <div className={`${styles['details-section-wrap']} high-z-index-layer`}>
        <Reveal textContent={title} element={"h2"} elementClass={`heading ${styles['details-title']}`}/>
        <div className={`${styles['details-description-wrap']}`}>
          <Reveal textContent={firstDescription} element={"p"} elementClass={`${styles['details-description']} body`}/>
          <Reveal textContent={secondDescription} element={"p"} elementClass={`${styles['details-description']} body`}/>
        </div>
      </div>
    </div>
  );
};



const CustomYouTubePlayer = ({ setVideoProgress, setVideoCurrentTime, setCopyLinkDesc, setIsPlayingProp, videoUrl, windowWidth }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0); // New state for progress
  const playerRef = useRef(null);

  const extractVideoId = (url) => {
    try {
      const parsedUrl = new URL(url);
      const params = new URLSearchParams(parsedUrl.search);
      return params.get('v');
    } catch (error) {
      console.error('Invalid URL', error);
      return null;
    }
  };

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      controls: 0,
      modestbranding: 1,
      fs: 0,
      rel: 0,
    }
  };

  const onReady = (event) => {
    event.target.addEventListener('onStateChange', (e) => {
      if (e.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        setIsBuffering(false);
        startProgressTracking(event.target);
      } else if (e.data === window.YT.PlayerState.BUFFERING) {
        setIsBuffering(true);
      } else if(e.data === window.YT.PlayerState.ENDED) {
        setIsPlaying(false);
        setIsBuffering(false);
        setIsPlayingProp(false);
      } else {
        setIsPlaying(false);
        setIsBuffering(false);
      }
    });
  };

  const startProgressTracking = (player) => {
    const interval = 500;

    const updateProgress = () => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      const newProgress = (currentTime / duration) * 100;

      // Convert currentTime to mm:ss format
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      setVideoProgress(newProgress); // Update the progress in the component
      setVideoCurrentTime(formattedTime); // Update the current time display in mm:ss format
    };

    const progressTracker = setInterval(updateProgress, interval);

    return () => {
      clearInterval(progressTracker);
    };
  };


  const handleScrollPause = () => {
    setTimeout(()=>{
      if (window.scrollY < 30 && isPlaying) {
        playerRef.current.internalPlayer.pauseVideo();
        setIsPlayingProp(false);
        setIsPlaying(false);

        gsap.to('.video-hover-desc .link-desc > span', {
          y: '100%',
          duration: 0.3,
          delay: 0,
          onComplete: () => {
            setCopyLinkDesc('Play Video');
            gsap.to('.video-hover-desc .link-desc > span', {
              y: '0%',
              duration: 0.3,
              delay: 0,
            });
          },
        });
      }

    }, 500)
 
  };

  // Add this in your useEffect or wherever appropriate to attach the scroll listener
  useEffect(() => {
    const onScroll = () => handleScrollPause();

    window.addEventListener('scroll', onScroll);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isPlaying]);


  const togglePlayPause = () => {
    if (isPlaying) {
      playerRef.current.internalPlayer.pauseVideo();
      setIsPlayingProp(false);
      setIsPlaying(false);

      gsap.to('.video-hover-desc .link-desc > span', {
        y: '100%',
        duration: 0.3,
        delay: 0,
        onComplete:()=>{
          setCopyLinkDesc('Play Video');
          gsap.to('.video-hover-desc .link-desc > span', {
            y: '0%',
            duration: 0.3,
            delay: 0,
          });
        }
      });
    } else {
      playerRef.current.internalPlayer.playVideo();
      if(windowWidth > 830){
         scrollToPercentageOfViewportHeight(140);
      }

      setIsPlayingProp(true);
      setIsPlaying(true);
      
      gsap.to('.video-hover-desc .link-desc > span', {
        y: '100%',
        duration: 0.3,
        delay: 0,
        onComplete:()=>{
          setCopyLinkDesc('Pause Video');
      
          gsap.to('.video-hover-desc .link-desc > span', {
            y: '0%',
            duration: 0.3,
            delay: 0,
          });
        }
      });
    }
  };

  return (
    <div className={`${styles['player']} ${isPlaying && !isBuffering && styles['playing']} ${isBuffering && styles['buffering']}`} onClick={togglePlayPause}>
      <YouTube
         videoId={extractVideoId(videoUrl)}
        opts={opts}
        onReady={onReady}
        ref={playerRef}
        
      />
     
   
    </div>
  );
};


const scrollToPercentageOfViewportHeight = (percentage) => {
  const vh = window.innerHeight * (percentage / 100);
  
  const performScroll = () => {
    window.scrollTo({
      top: vh,
      behavior: 'smooth',  // Smooth scrolling behavior
    });
  };

  // Ensure the scroll happens on the next animation frame
  requestAnimationFrame(performScroll);
};




const TextSection = ({ sectionKey, value }) => {
  if (!value) {
    return <p>nodeets</p>; // or return a placeholder like <p>No details available</p>
  }

  const { firstDescription, secondDescription } = value;

  return (
    <div key={sectionKey} className={`${styles['details-section']} ${styles['text-section']} high-z-index-layer`}>
      <div className={`${styles['details-section-wrap']}`}>
          <Reveal textContent={firstDescription} element={"p"} elementClass={`${styles['details-description']} body`}/>

      </div>
      <div className={`${styles['details-section-wrap']}`}>
          <Reveal custom={5} textContent={secondDescription} element={"p"} elementClass={`${styles['details-description']} body`}/>
      </div>
    </div>
  );
};


const TitleSection = ({ sectionKey, value }) => {
  if (!value) {
    return <p>nodeets</p>; // or return a placeholder like <p>No details available</p>
  }

  const { title } = value;

  return (
    <div key={sectionKey} className={`${styles['title-section']} high-z-index-layer`}>
      <div className={`${styles['title-section-wrap']}`}>
      <Reveal textContent={title} element={"h3"} elementClass={`heading`}/>
      </div>
    </div>
  );
};




const LargeImageSection = ({ sectionKey, value }) => {
  // Always call useState at the top level
  const [isLoading, setIsLoading] = useState(true);

  if (!value) {
    return <p>No image available</p>; // Placeholder message
  }

  const { largeImage, blurhash } = value;

  // Handle image load event
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div key={sectionKey} className={styles['large-section']}>
      {isLoading && blurhash && (
        <img
          className={styles['large-section-wrap']}
          src={blurhash}
          alt="Blurhash"
          style={{display: !isLoading ? 'none' : 'block', width: '100%', height: 'auto'}}
           loading='lazy'
        />
      )}
      <img
        className={styles['large-section-wrap']}
        src={largeImage}
        alt="Large Image"
        onLoad={handleImageLoad}
        style={{  width: '100%', zIndex: 2 }}
         loading='lazy'
      />
    </div>
  );
};

const NavigationSection = ({ currentIndex, projectList, currentProject }) => {
  // Ensure projectList is not empty
  if (projectList.length === 0) {
    return null; // or some placeholder UI
  }

  const getPrevProjectId = () => {
    if (projectList.length === 0) return null;
    return projectList[(currentIndex - 1 + projectList.length) % projectList.length]?.id;
  };

  const getNextProjectId = () => {
    if (projectList.length === 0) return null;
    return projectList[(currentIndex + 1) % projectList.length]?.id;
  };

  return (
    <div className={`${styles['navigation-section']} high-z-index-layer`}>
      <div className={`${styles['nav-button']} ${styles['prev']}`} >
        <DelayLink to={`/projects/${getPrevProjectId()}`} className={`heading`}   delay={2000} >Prev</DelayLink>

      </div>
      <div className={`${styles['project-nav-indicator']} body`}>
        {currentProject}
      </div>
      <div  className={`${styles['nav-button']} ${styles['next']}`} >
        <DelayLink to={`/projects/${getNextProjectId()}`} className={`heading`}  delay={2000}  >Next</DelayLink>

      </div>
    </div>
  );
};

