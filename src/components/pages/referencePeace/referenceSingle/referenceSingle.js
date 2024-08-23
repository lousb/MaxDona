import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useFooter } from "../../../../context/FooterContext";
import styles from '../referencePeace.module.css';
import '../referencePeace.module.css';
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import Reveal from "../../../../utils/textElementReveal/textElementReveal";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import gsap from "gsap";
import { usePdf } from '@mikecousins/react-pdf';
import YouTube from 'react-youtube';


const ReferenceSingle = () =>{
  const { projectId } = useParams();
  const { dispatch } = useFooter();
  const [projectData, setProjectData] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollPositionRef = useRef(0);

  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlayingProp, setIsPlayingProp] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageNumber, setNextPageNumber] = useState(false);

  const childRef = useRef();


  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, []); 

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectDoc = doc(db, 'referencePeace', projectId);
        const projectSnapshot = await getDoc(projectDoc);
        if (projectSnapshot.exists()) {
          const data = projectSnapshot.data();
          setProjectData(data);
          console.log(data);
        } else {
          console.error('Project not found.');
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleImageClick = (groupIndex, imageIndex) => {
    let clickedIndex = 0;
    for (let i = 0; i < groupIndex; i++) {
      if (projectData?.imageSections[i]?.images) {
        clickedIndex += projectData.imageSections[i].images.length;
      }
    }
    clickedIndex += imageIndex;

    // Log the click
    console.log(`Image clicked - Group Index: ${groupIndex}, Image Index: ${imageIndex}, Total Index: ${clickedIndex}`);

    // Store the current scroll position
    scrollPositionRef.current = window.scrollY;

    setSelectedImageIndex(clickedIndex);
  };

  const renderSection = (section, index) => {
    switch (section.type) {
      case 'video':
        return (
          <div className={`${styles['main-section-image-wrap']} main-section-image-wrap`}>
            <div className={`${styles['main-section-image']} main-section-image arrow-hover`}>
            <div className={`${styles['main-section-image-overlay']} main-section-image-overlay`} style={{ backgroundImage: `url(${projectData?.mainFeaturedImage})` }}>

            </div>
              <div className={styles['video-container']}>
                <div className={`player__wrapper ${styles['player__wrapper']}`}>
                  <CustomYouTubePlayer setVideoProgress={setVideoProgress} setIsPlayingProp={setIsPlayingProp} videoUrl={section.videoUrl}/>

                </div>
              </div> 
            </div>
            <div className={`main-video-controls-overlay ${styles['main-video-controls-overlay']}`}>
              {projectData ? 
                <div className={`body main-description-right-wrap ${styles['main-description-right-wrap']}`} >
                  <span>{projectData.videoName} (2022)</span>
                  <span className='primary-button'>
                  Full Video
                  </span>
                </div>
              :
                <></>
              }  
              <div className={`body scroll-notification scroll-notification-single ${styles['scroll-notification']}`}>
                <p>
                  (<div><span>SCROLL</span></div>)
                </p>
                <p className={`body single-click-anywhere ${styles['single-click-anywhere']}`}>
                  Click Anywhere To 
                  <p className={`play-text ${styles['play-text']} ${ isPlayingProp ? 'play-text-toggle':''}`}>
                    <p>play</p>
                    <p>pause</p>
                  </p> 
                </p>

              </div>
              <div className={`${styles['progress-bar']} ${ isPlayingProp ? '':'stop-progress-toggle'}`}>
                  <div className={`${styles['progress']}  `} style={{ width: `${videoProgress}%` }}></div>
              </div>
            </div>

          </div>
        );
      case 'image':
        return (
          <ImageSection
            key={`image-${index}`}
            groupKey={`image-${index}`}
            groupImages={section.images}
            groupIndex={index}
            handleImageClick={handleImageClick}
            projectData={projectData}
          />
        );
      case 'PDF':
        return (
          <div className="pdf-section" key={`pdf-${index}`}>
            <PDFViewer ref={childRef} pdfLink={section.pdfLink} pdfType={section.pdfType} currentPage={currentPage} nextPageNumber={nextPageNumber} setNextPageNumber={setNextPageNumber} setCurrentPage={setCurrentPage}/>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    // Update the footer state when the component is mounted
    dispatch({ type: "Small" });

    // Clean up the state when the component is unmounted
    return () => {
      dispatch({ type: "Default" });
    };
  }, [dispatch]);

  if (!projectData) return <div>Loading...</div>;

  // Create an array of sections manually
  const sections = [];

  // Add image sections
  if(projectData.volumeType && projectData.volumeType === 'Image' && projectData.imageSections){
      projectData.imageSections.forEach((section, index) => {
        sections.push({
          type: 'image',
          images: section.images,
          index,
        });
      });

  }
  

  // Add video sections
    if(projectData.volumeType && projectData.volumeType === 'Video' && projectData.videoSections){
    projectData.videoSections.forEach((section, index) => {
      sections.push({
        type: 'video',
        videoName: section.videoName,
        videoUrl: section.videoUrl,
        index,
      });
    });
  }

  // Add PDF sections
    if(projectData.volumeType && projectData.volumeType === 'PDF' && projectData.pdfSections){
    projectData.pdfSections.forEach((section, index) => {
      sections.push({
        type: 'PDF',
        pdfName: section.pdfName,
        pdfLink: section.pdfLink,
        pdfType: section.pdfType, 
        index,
      });
    });
  }

const handlePreviousPageInChild = () => {
  if (childRef.current) {
    childRef.current.goToPreviousPage();
  }
};

const handleNextPageInChild = () => {
  if (childRef.current) {
    childRef.current.goToNextPage();
  }
};

    return(
        <div className={`reference-peace-single ${styles['reference-peace-single']}`}>
            <div className={`${styles['rp-title-wrap']}`}>
              <Reveal element={'p'} custom={10} elementClass={`title ${styles['rp-title']}`} textContent={projectData ? projectData.displayName : 'Loading...'}/>
              {
                projectData.volumeType && projectData.volumeType === 'PDF' && projectData.pdfSections ? (
                  <>
                    <div className={`body ${styles['pdf-page-numbers']}`}>
                      Page {currentPage}{nextPageNumber && <>,</>}<br/>
                      {nextPageNumber && <>
                      Page {nextPageNumber}
                      </>}
                    </div>
                    <div className={`${styles['pdf-page-switchers']}`}>
                    <button className={`${styles['pdf-page-prev']}`} onClick={handlePreviousPageInChild}>
                      Previous
                    </button>
                    <button className={`${styles['pdf-page-next']}`} onClick={handleNextPageInChild}>
                      Next
                    </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Reveal element={'p'} custom={25} elementClass={`body ${styles['rp-description']}`} textContent={projectData ? projectData.mainDescription1 : 'Loading...'}/>
                    <Reveal element={'p'} custom={25} elementClass={`body ${styles['rp-description']}`} textContent={projectData ? projectData.mainDescription2 : 'Loading...'}/>
                  </>
                )
              }

        
            </div>
            {projectData && (
                <>
                 {sections.map((section, index) => renderSection(section, index))}
                </>
              )}
        </div>
    )
}

const ParallaxImage = ({ imageUrl, blurhashUrl }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(blurhashUrl);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImageSrc(imageUrl);
    };
  }, [imageUrl]);

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
      imageRef.current.style.transition = 'ease all 200ms';
      setIsHovered(true);
      setTimeout(() => {
        if (imageRef.current) {
          imageRef.current.style.transition = 'cubic-bezier(0.76, 0, 0.24, 1) all 0ms, object-position 0s ease';
        }
      }, 600);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (imageRef.current) {
      imageRef.current.style.transition = 'ease all 200ms';
      imageRef.current.style.transform = 'translate(0px, 0px) scale(1.1)';
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
        src={imageSrc}
        alt="Parallax Image"
        className={styles['masonry-image']}
        style={{
          transform: `translate(${maskPosition.x}px, ${maskPosition.y}px) scale(1.1)`,
          filter: imageSrc === blurhashUrl ? 'blur(10px)' : 'blur(0px)',
        }}
      />
    </div>
  );
};

const ImageSection=({ groupKey, groupImages, groupIndex, handleImageClick, projectData })=>{
  const column = useRef(null);
  const { projectId } = useParams();

  const calculateCumulativeIndex = (groupIndex, imageIndex, data) => {
  let clickedIndex = 0;

  // Loop through previous groups and accumulate their image counts
  for (let i = 0; i < groupIndex; i++) {
    if (data?.imageUrls[`image${i + 1}`]) {
      clickedIndex += data.imageUrls[`image${i + 1}`].length;
    }
  }

  // Add the current image index within its group
  clickedIndex += imageIndex;

  return clickedIndex;
};
const calculateTotalIndex = (groupIndex, imageIndex, projectData) => {
  let totalIndex = 0;

  for (let i = 0; i < groupIndex; i++) {
    const groupImages = projectData?.imageUrls[`image${i + 1}`];
    if (groupImages) {
      totalIndex += groupImages.length;
    }
  }

  totalIndex += imageIndex;
  return totalIndex;
};

useEffect(() => {
  const handleImagesLoaded = () => {
    const masonrySection = document.querySelector(`.${styles['masonry-section']}.${groupKey} > div > div`);

    if (masonrySection) {
      const childCount = masonrySection.childElementCount;

      for (let i = 0; i < childCount; i++) {
        const child = masonrySection.children[i];
        child.classList.add(`column-${i + 1}`);
        child.classList.add(`masonry-column`);
      }

      const calculateTallestColumnHeight = () => {
        let tallestHeight = 0;
        const columns = document.querySelectorAll(`.${styles['masonry-section']}.${groupKey} .masonry-column`);
    
        columns.forEach((column) => {
          const height = column.offsetHeight;
          if (height > tallestHeight) {
            tallestHeight = height;
          }
        });
    
        return tallestHeight;
      };
    
      const tallestColumnHeight = calculateTallestColumnHeight();
      const columns = document.querySelectorAll(`.${styles['masonry-section']}.${groupKey} .masonry-column`);

      columns.forEach((column) => {
        const columnHeight = column.offsetHeight;
        const difference = tallestColumnHeight - columnHeight;

        gsap.to(column, {
          marginTop: difference,
          scrollTrigger: {
            trigger: `.${styles['masonry-section']}.${groupKey}`,
            start: `-90px top`,
            end: ()=>`+=${tallestColumnHeight - (window.innerHeight/2.5)}`,
            markers: true,
            scrub: 1,
          },
        });
      });
    } else {
      console.log('No masonry section found.');
    }
  };

  // Check if all images are loaded
  const images = document.querySelectorAll(`.${styles['masonry-section']}.${groupKey} img`);
  let loadedCount = 0;

  const checkAllImagesLoaded = () => {
    loadedCount++;
    if (loadedCount === images.length) {
      handleImagesLoaded();
    }
  };

  images.forEach((image) => {
    if (image.complete) {
      checkAllImagesLoaded();
    } else {
      image.addEventListener('load', checkAllImagesLoaded);
    }
  });

  return () => {
    images.forEach((image) => {
      image.removeEventListener('load', checkAllImagesLoaded);
    });
  };
}, [groupKey, projectData]);

  
  
  
 
 


  return(
    <div className={`arrow-hover masonry-section ${styles['masonry-section']} ${groupKey}`} key={groupKey}>
      <ResponsiveMasonry columnsCountBreakPoints={{ 300: 1, 500: 2, 700: 3, 900: 4 }}>
        <Masonry columnsCount={4} gutter="1.4vw">
          
        {groupImages.map((imageUrl, index) => {
        const totalIndex = calculateTotalIndex(groupIndex, index, projectData);

        return (
          <Link to={`/projects/${projectId}/${totalIndex}`} key={index}>
            <div className="column">
              <ParallaxImage key={index} imageUrl={imageUrl.url} blurhashUrl={imageUrl.blurhash}/>
            </div>
          </Link>
        );
      })}


        </Masonry>
      </ResponsiveMasonry>


    </div>
  );

};

const PDFViewer = React.forwardRef(({ pdfLink, pdfType, currentPage, nextPageNumber, setNextPageNumber, setCurrentPage, onPreviousPage, onNextPage }, ref) => {
const [page, setPage] = useState(1);
const [mode, setMode] = useState('single');
const canvasRef1 = useRef(null);
const canvasRef2 = useRef(null);

  const handleDocumentLoadSuccess = useCallback((document) => {
    console.log("Document loaded successfully:", document);
    if (mode === 'double' && page % 2 !== 0) {
      setPage(prevPage => Math.max(prevPage - 1, 1)); // Ensure even page number in double mode
    }
  }, [mode, page]);

  const handleDocumentLoadError = useCallback((error) => {
    console.error("Error loading document:", error);
  }, []);

  const { pdfDocument, pdfPage } = usePdf({
    file: pdfLink,
    page,
    canvasRef: canvasRef1,
    onDocumentLoadSuccess: handleDocumentLoadSuccess,
    onError: handleDocumentLoadError,
  });

  const { pdfPage: pdfPage2 } = usePdf({
    file: pdfLink,
    page: mode === 'double' && page + 1 <= pdfDocument?.numPages ? page + 1 : null,
    canvasRef: canvasRef2,
    onDocumentLoadSuccess: handleDocumentLoadSuccess,
    onError: handleDocumentLoadError,
  });

  const handleCanvasClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const midPoint = rect.width / 2;

    if (mode === 'single') {
      if (clickX < midPoint) {
        setPage(prev => Math.max(prev - 1, 1));
        setCurrentPage(prev => Math.max(prev - 1, 1));
      } else {
        setPage(prev => Math.min(prev + 1, pdfDocument.numPages));
        setCurrentPage(prev => Math.min(prev + 1, pdfDocument.numPages));
      }
    } else if (mode === 'double') {
      if (clickX < midPoint) {
        setPage(prev => Math.max(prev - 2, 1));
        setCurrentPage(prev => Math.max(prev - 2, 1));
      } else {
        setPage(prev => {
          const newPage = prev + 2;
          return newPage <= pdfDocument.numPages ? newPage : prev;
        });
        setCurrentPage(prev => {
          const newPage = prev + 2;
          return newPage <= pdfDocument.numPages ? newPage : prev;
        });
      }
    }
  };

  useEffect(() => {
    // Ensure proper page handling at the end of the document
    if (mode === 'double' && pdfDocument && page + 1 > pdfDocument.numPages) {
      setPage(prev => Math.max(prev - 2, 1));
    } else if (mode === 'single' && pdfDocument && page > pdfDocument.numPages) {
      setPage(1);
    }
  }, [pdfDocument, page, mode]);

  useEffect(() => {
    if (pdfType === '1-page') {
      setMode('single');
    } else {
      setMode('double');
    }
  }, [pdfType]);

  const numPages = pdfDocument?.numPages || 0;
  setNextPageNumber(mode === 'double' && page + 1 <= numPages ? page + 1 : null);

  const goToPreviousPage = () => {
    if (mode === 'single') {
      setPage(prev => Math.max(prev - 1, 1));
      setCurrentPage(prev => Math.max(prev - 1, 1));
    } else if (mode === 'double') {
      setPage(prev => Math.max(prev - 2, 1));
      setCurrentPage(prev => Math.max(prev - 2, 1));
    }
  };

  const goToNextPage = () => {
    if (mode === 'single') {
      setPage(prev => Math.min(prev + 1, pdfDocument.numPages));
      setCurrentPage(prev => Math.min(prev + 1, pdfDocument.numPages));
    } else if (mode === 'double') {
      setPage(prev => {
        const newPage = prev + 2;
        return newPage <= pdfDocument.numPages ? newPage : prev;
      });
      setCurrentPage(prev => {
        const newPage = prev + 2;
        return newPage <= pdfDocument.numPages ? newPage : prev;
      });
    }
  };

  // Expose the functions to the parent component
   useImperativeHandle(ref, () => ({
    goToPreviousPage,
    goToNextPage,
  }));


  return (
    <div className='arrow-hover'>
      {!pdfDocument && !pdfPage && <span>Loading PDF...</span>}
      {pdfDocument && (
        <>
          {mode === 'single' && (
            <canvas style={{ width: '100%' }} ref={canvasRef1} onClick={handleCanvasClick} />
          )}
          {mode === 'double' && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <canvas ref={canvasRef1} onClick={handleCanvasClick} style={{ width: '49%', height: 'auto' }} />
              {nextPageNumber && (
                <canvas ref={canvasRef2} onClick={handleCanvasClick} style={{ width: '49%', height: 'auto' }} />
              )}
            </div>
          )}
        </>
      )}
      <div style={{ textAlign: 'center', marginBlock: '10px', color: 'white' }}>
        {pdfDocument && (
          <>
            {mode === 'single' && <span>Page {page} of {numPages}</span>}
            {mode === 'double' && (
              <span>Pages {page} - {nextPageNumber} of {numPages}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
});




const CustomYouTubePlayer = ({ setVideoProgress, setIsPlayingProp, videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0); // State for progress
  const playerRef = useRef(null);
  const progressRef = useRef(null); // Ref to store the interval

  // Function to extract video ID from URL
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

  // YouTube player options
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      controls: 0,
      modestbranding: 1,
      fs: 0,
      rel: 0,
    },
  };

  // Handle player state changes
  const onReady = (event) => {
    const player = event.target;
    player.mute();
    event.target.addEventListener('onStateChange', (e) => {
      if (e.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        setIsBuffering(false);
        startProgressTracking(event.target);
      } else if (e.data === window.YT.PlayerState.BUFFERING) {
        setIsBuffering(true);
      } else {
        setIsPlaying(false);
        setIsBuffering(false);
      }
    });
  };

  // Start tracking progress
  const startProgressTracking = (player) => {
    const interval = 500; // Interval for progress updates
    const updateProgress = () => {
      const currentTime = player.getCurrentTime();
      const duration = player.getDuration();
      const newProgress = (currentTime / duration) * 100;
      setVideoProgress(newProgress);
      setProgress(newProgress); // Update internal state
    };

    progressRef.current = setInterval(updateProgress, interval);
  };

  // Cleanup progress tracking on unmount
  useEffect(() => {
    return () => {
      if (progressRef.current) {
        clearInterval(progressRef.current);
      }
    };
  }, []);

  // Toggle play/pause state
  const togglePlayPause = () => {
    if (isPlaying) {
      playerRef.current.internalPlayer.pauseVideo();
      setIsPlayingProp(false);
      setIsPlaying(false);
    } else {
      playerRef.current.internalPlayer.playVideo();
      setIsPlayingProp(true);
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`${styles['player']} ${isPlaying ? styles['playing'] : ''} ${isBuffering ? styles['buffering'] : ''}`}
      onClick={togglePlayPause}
    >
      <YouTube
        videoId={extractVideoId(videoUrl)}
        opts={opts}
        onReady={onReady}
        ref={playerRef}
      />
     
    </div>
  );
};


export default ReferenceSingle;