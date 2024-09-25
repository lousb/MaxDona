import React, { useEffect, useState } from 'react';
import styles from './image.module.css';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

const SingleImageView = () => {
  const { projectId, imageIndex } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(parseInt(imageIndex, 10));
const [currentBlurhash, setCurrentBlurhash] = useState(null);

  



  useEffect(() => {
    return () => {
      window.scrollTo(0, 0);
    };
  }, []);

  

  useEffect(() => {

    if (projectData && projectData.projectColor) {
      document.documentElement.style.setProperty('--primary-color', projectData.projectColor);
      document.documentElement.style.setProperty('--secondary-dark', projectData.projectColor);
    }
    window.scrollTo(0, 0);
  }, [projectData]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectDoc = doc(db, 'projects', projectId);
        const projectSnapshot = await getDoc(projectDoc);
        if (projectSnapshot.exists()) {
          const data = projectSnapshot.data();
          setProjectData(data);
          setCurrentBlurhash(getBlurhashById(data, parseInt(imageIndex, 10))); // Set initial blurhash
        } else {
          console.error('Project not found.');
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [projectId, imageIndex]);
  

  const getTotalImageCount = (projectData) => {
    if (projectData) {
      return Object.values(projectData.imageUrls).flat().length;
    }
    return 0;
  };

  const getImageUrlById = (projectData, imageId) => {
    if (projectData && projectData.imageUrls) {
      const images = Object.values(projectData.imageUrls).flat();
      const image = images.find(img => img.id === imageId);
      return image ? image.url : null;
    }
    return null;
  };

  const getBlurhashById = (projectData, imageId) => {
    if (projectData && projectData.imageUrls) {
      const images = Object.values(projectData.imageUrls).flat();
      const image = images.find(img => img.id === imageId);
      return image ? image.blurhash : null;
    }
    return null;
  };
  
  

  const handleImageNavigation = (increment) => {
    if (!projectData) return;

    const totalImages = getTotalImageCount(projectData);
    const imageIds = Object.values(projectData.imageUrls).flat().map(image => image.id);

    setSelectedImageIndex((prevIndex) => {
      const currentIdIndex = imageIds.indexOf(prevIndex);
      if (currentIdIndex === -1) return prevIndex; // Handle case where prevIndex is not found

      let newIdIndex = (currentIdIndex + increment + totalImages) % totalImages;
      const newImageId = imageIds[newIdIndex];

      console.log('Navigating from:', prevIndex, 'to:', newImageId); // Debugging log

      setCurrentBlurhash(getBlurhashById(projectData, newImageId));
      window.history.replaceState(null, '', `/#/projects/${projectId}/${newImageId}`);

      return newImageId;
    });
  };
  
  
  
  
  
  const handleImageLoad = () => {
    // After the main image loads, update the blurhash for the current image
    console.log('image loaded');
    setCurrentBlurhash(getBlurhashById(projectData, selectedImageIndex));
  };
  
  
  useEffect(() => {
    document.title = `${selectedImageIndex ? `${selectedImageIndex} - ` : ''}${projectData ? `${projectData.displayName} - ` : ''}Max Dona`;
  }, [selectedImageIndex, projectData]);

  const preloadNearbyImages = () => {
    const totalImages = getTotalImageCount(projectData);
    const imageIds = Object.values(projectData.imageUrls).flat().map(image => image.id);

    const indicesToPreload = [];
    for (let i = 1; i <= 10; i++) {
      indicesToPreload.push(imageIds[(imageIds.indexOf(selectedImageIndex) + i) % totalImages]); // Next images
      indicesToPreload.push(imageIds[(imageIds.indexOf(selectedImageIndex) - i + totalImages) % totalImages]); // Previous images
    }

    return indicesToPreload.filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
  };
  
  

  return (
    <section className={`single-image-page ${styles['projectPageSection1']}`}>
      <div className={styles.mainSectionTopDetails}>
        <h1 className={`title ${styles['project-title']}`}>{projectData && projectData.displayName}</h1>
        <h2 className={`body ${styles['directed-subtext']}`}>{projectData && 'Directed by Max Dona'}</h2>
      </div>

      <div className={styles.imageWrap}>
        {projectData && (
          <>
            {/* Main Blurhash Fallback */}
            <img
              src={currentBlurhash}
              alt={`Blurhash ${selectedImageIndex}`}
              className={styles.blurhashImage}
            />

            {/* Main Image */}
            <img
              key={selectedImageIndex} // Unique key forces React to remount
              src={getImageUrlById(projectData, selectedImageIndex)}
              alt={`Image ${selectedImageIndex}`}
              className={`${styles['single-image']}`}
              onLoad={handleImageLoad}
            />

            {/* Preload next/previous 10 images' blurhash in hidden containers */}
            {preloadNearbyImages().map((id) => (
              <img
                key={id}
                src={getBlurhashById(projectData, id)}
                alt={`Preload Blurhash ${id}`}
                className={styles.hiddenPreloadedBlurhash} // CSS will hide these
              />
            ))}
          </>
        )}
      </div>

      <div className={styles.buttonWrap}>
        <div className={styles.buttonWrapRight}>
          <button className={`primary-button ${styles['navigationButton']}`}>Grid View</button>
          <button className={`primary-button ${styles['mainSectionButtonDetails']}`}>Full Video</button>
        </div>
        <div className={styles.buttonWrapLeft}>
          <button
            className={`primary-button ${styles['navigationButton']}`}
            onClick={() => handleImageNavigation(-1)}
          >
            Prev Image
          </button>
          <button
            className={`primary-button ${styles['navigationButton']}`}
            onClick={() => handleImageNavigation(1)}
          >
            Next Image
          </button>
        </div>
      </div>
    </section>
  );
  
};

export default SingleImageView;
