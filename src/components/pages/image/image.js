import React, { useEffect, useState } from 'react';
import styles from './image.module.css';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';

const SingleImageView = () => {
  const { projectId, imageIndex } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(parseInt(imageIndex, 10));

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectDoc = doc(db, 'projects', projectId);
        const projectSnapshot = await getDoc(projectDoc);
        if (projectSnapshot.exists()) {
          const data = projectSnapshot.data();
          setProjectData(data);
        } else {
          console.error('Project not found.');
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const getTotalImageCount = (projectData) => {
    if (projectData) {
      let totalCount = 0;
      totalCount += projectData.imageUrls.image1 ? projectData.imageUrls.image1.length : 0;
      totalCount += projectData.imageUrls.image2 ? projectData.imageUrls.image2.length : 0;
      totalCount += projectData.imageUrls.image3 ? projectData.imageUrls.image3.length : 0;
      return totalCount;
    }
    return 0;
  };

  const getImageUrlByIndex = (projectData, index) => {
    if (projectData) {
      const image1Count = projectData.imageUrls.image1 ? projectData.imageUrls.image1.length : 0;
      const image2Count = projectData.imageUrls.image2 ? projectData.imageUrls.image2.length : 0;
      if (index < image1Count) {
        return projectData.imageUrls.image1[index];
      } else if (index < image1Count + image2Count) {
        return projectData.imageUrls.image2[index - image1Count];
      } else {
        return projectData.imageUrls.image3[index - (image1Count + image2Count)];
      }
    }
    return null;
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handleImageNavigation = (increment) => {
    const totalImages = getTotalImageCount(projectData);
    setSelectedImageIndex((prevIndex) => {
      let newIndex = prevIndex + increment;
      if (newIndex >= totalImages) {
        newIndex = 0;
      } else if (newIndex < 0) {
        newIndex = totalImages - 1;
      }
      return newIndex;
    });
  };
  

  return (
    <section className={`single-image-page ${styles['projectPageSection1']}`}>
        {/* Display project details */}
        <div className={styles.mainSectionTopDetails}>
          <h1 className={`title ${styles['project-title']}`}>{projectData && projectData.displayName}</h1>
          <h2 className={`body ${styles['directed-subtext']}`}>{projectData && 'Directed by Max Dona'}</h2>
        </div>

      <div className={styles.imageWrap}>
        {projectData && (
          <img
            src={getImageUrlByIndex(projectData, selectedImageIndex)}
            alt={`Image ${selectedImageIndex}`}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.thumbnailWrap}>
        {projectData &&
          projectData.imageUrls.image1 &&
          projectData.imageUrls.image1.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Thumbnail ${index}`}
              className={`${styles.thumbnail} ${
                selectedImageIndex === index ? styles.selectedThumbnail : ''
              }`}
              onClick={() => handleImageClick(index)}
            />
          ))}
        {projectData &&
          projectData.imageUrls.image2 &&
          projectData.imageUrls.image2.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Thumbnail ${index}`}
              className={`${styles.thumbnail} ${
                selectedImageIndex === index + (projectData.imageUrls.image1 ? projectData.imageUrls.image1.length : 0)
                  ? styles.selectedThumbnail
                  : ''
              }`}
              onClick={() => handleImageClick(index + (projectData.imageUrls.image1 ? projectData.imageUrls.image1.length : 0))}
            />
          ))}
      </div>
     
      <div className={styles.buttonWrap}>
      <div className={styles.buttonWrapRight}>
      <div className={styles.buttonContainer}>
          <button className={`primary-button ${styles['navigationButton']}`}>
            Grid View
          </button>
        </div>
          <button className={`primary-button ${styles['mainSectionButtonDetails']}`}>
            Full Video
          </button>
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
