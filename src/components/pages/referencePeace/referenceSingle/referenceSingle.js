import React, { useEffect, useRef, useState } from "react";
import { useFooter } from "../../../../context/FooterContext";
import styles from '../referencePeace.module.css';
import '../referencePeace.module.css';
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import Reveal from "../../../../utils/textElementReveal/textElementReveal";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import gsap from "gsap";
import { version } from 'pdfjs-dist';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';


// Set the workerSrc globally for PDF.js
GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;


const ReferenceSingle = () =>{
  const { projectId } = useParams();
  const { dispatch } = useFooter();
  const [projectData, setProjectData] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const scrollPositionRef = useRef(0);

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
          <div key={`video-${index}`}>
            <h2>{section.videoName}</h2>
            <iframe src={section.videoUrl} title={section.videoName} />
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
          <div key={`pdf-${index}`}>
            <h2>{section.pdfName}</h2>
            <a href={section.pdfLink} target="_blank" rel="noopener noreferrer">
              {section.pdfName}
            </a>
            <PDFViewer pdfLink={section.pdfLink} />
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
  if (projectData.imageSections) {
    projectData.imageSections.forEach((section, index) => {
      sections.push({
        type: 'image',
        images: section.images,
        index,
      });
    });
  }

  // Add video sections
  if (projectData.videoSections) {
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
  if (projectData.pdfSections) {
    projectData.pdfSections.forEach((section, index) => {
      sections.push({
        type: 'PDF',
        pdfName: section.pdfName,
        pdfLink: section.pdfLink,
        index,
      });
    });
  }



    return(
        <div className={`reference-peace-single ${styles['reference-peace-single']}`}>
            <div className={`${styles['rp-title-wrap']}`}>
              <Reveal element={'p'} custom={10} elementClass={`title ${styles['rp-title']}`} textContent={projectData ? projectData.displayName : 'Loading...'}/>
              <Reveal element={'p'} custom={25} elementClass={`body ${styles['rp-description']}`} textContent={projectData ? projectData.mainDescription1 : 'Loading...'}/>
              <Reveal element={'p'} custom={25} elementClass={`body ${styles['rp-description']}`} textContent={projectData ? projectData.mainDescription2 : 'Loading...'}/>

        
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
    <div className={`masonry-section ${styles['masonry-section']} ${groupKey}`} key={groupKey}>
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

const PDFViewer = ({ pdfLink }) => {
  const [pdf, setPdf] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const canvasRefs = [useRef(null), useRef(null)];

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const loadingTask = getDocument(pdfLink);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
      } catch (error) {
        console.error('Error fetching PDF:', error);
      }
    };

    fetchPDF();
  }, [pdfLink]);

  useEffect(() => {
    if (pdf) {
      renderPage(currentPage, 0);
      renderPage(currentPage + 1, 1);
    }
  }, [pdf, currentPage]);

  const renderPage = async (pageNum, canvasIndex) => {
    if (pdf && pageNum < pdf.numPages) {
      const page = await pdf.getPage(pageNum + 1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = canvasRefs[canvasIndex].current;
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
    } else {
      const canvas = canvasRefs[canvasIndex].current;
      if (canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleClick = (event) => {
    const { left, width } = event.target.getBoundingClientRect();
    const clickX = event.clientX - left;
    if (clickX < width / 2) {
      if (currentPage > 0) setCurrentPage(currentPage - 2);
    } else {
      if (currentPage + 2 < pdf.numPages) setCurrentPage(currentPage + 2);
    }
  };

  return (
    <div className="pdf-viewer">
      <canvas ref={canvasRefs[0]} className="pdf-canvas" onClick={handleClick} />
      <canvas ref={canvasRefs[1]} className="pdf-canvas" onClick={handleClick} />
    </div>
  );
};


export default ReferenceSingle;