// helpers.js
export const getTotalImageCount = (projectData) => {
    let totalImageCount = 0;
    if (projectData && projectData.imageUrls) {
      Object.keys(projectData.imageUrls).forEach((folderKey) => {
        const folderImages = projectData.imageUrls[folderKey];
        totalImageCount += folderImages.length;
      });
    }
    return totalImageCount;
  };
  
  export const getImageUrlByIndex = (projectData, index) => {
    let currentIndex = index;
    let currentFolderIndex = 0;
    while (currentIndex >= projectData.imageUrls[`image${currentFolderIndex + 1}`].length) {
      currentIndex -= projectData.imageUrls[`image${currentFolderIndex + 1}`].length;
      currentFolderIndex += 1;
    }
    return projectData.imageUrls[`image${currentFolderIndex + 1}`][currentIndex];
  };
  