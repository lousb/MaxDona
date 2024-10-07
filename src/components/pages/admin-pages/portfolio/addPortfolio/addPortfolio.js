import './addPortfolio.css'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../../../../firebase/firebase";
import { useFooter } from "../../../../../context/FooterContext";
import { projectMainSection, projectDetailSection, textSectionSource, titleSectionSource } from '../../formSource';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { encode } from 'blurhash';
import MainHero from "./SVG/MainHeroSVG";
import FiftyFifty from "./SVG/fiftyfiftySVG";
import LargeImage from "./SVG/LargeImageSVG";
import Masonry from "./SVG/MasonrySVG";
import Text from "./SVG/TextSVG";
import Title from "./SVG/TitleSVG";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';


const AddProject = ({ inputs, title }) => {
  const [perc, setPerc] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [sections, setSections] = useState(["main, image1"]);
  const [imageSectionCount, setImageSectionCount] = useState(0);
  const [detailSectionCount, setDetailSectionCount] = useState(0);
  const [textSectionCount, setTextSectionCount] = useState(0);
  const [titleSectionCount, setTitleSectionCount] = useState(0);
  const [largeImageSectionCount, setLargeImageSectionCount] = useState(0);
  const [sectionOrder, setSectionOrder] = useState(["main", {name: 'image', index: 1}]);

  
  const [file, setFile] = useState("");
  const { dispatch } = useFooter();

const [imageFiles, setImageFiles] = useState(Array.from({ length: 25 }, () => []));
  const [detailSections, setDetailSections] = useState([]);
  const [textSections, setTextSections] = useState([]);
  const [largeImageSections, setLargeImageSections] = useState([]);
  const [titleSections, setTitleSections] = useState([]);

  const [dragOverSection, setDragOverSection] = useState(null);
  const [mainFeaturedImage, setMainFeaturedImage] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#0000FF');

  const handleColorChange = (event) => {
    setPrimaryColor(event.target.value);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--project-color', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    const uploadFile = async () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, `images/${name}`);
  
      try {
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setPerc(progress);
          },
          (error) => {
            console.log('Error during upload:', error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setData((prev) => ({ ...prev, img: downloadURL }));
            } catch (error) {
              console.log('Error getting download URL:', error);
            }
          }
        );
      } catch (error) {
        console.log('Error uploading file:', error);
      }
    };
  
    if (file) {
      uploadFile();
    }
  }, [file]);
  

  const handleDragEnter = (sectionIndex) => {
    setDragOverSection(sectionIndex);
  };
  
  const handleDragLeave = () => {
    setDragOverSection(null);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  const handleDrop = (e, sectionIndex, index) => {
    e.preventDefault();
    setDragOverSection(null);
  
    const files = e.dataTransfer.files;
    const filesArray = Array.from(files).slice(0, Math.min(files.length, 25 - index));
  
    const updatedImageFiles = [...imageFiles];
    updatedImageFiles[sectionIndex].splice(index, filesArray.length, ...filesArray);
    setImageFiles(updatedImageFiles);
  };
  
  

const handleAddField = (section) => {
  let newSection = "";
  let sectionType = '';
  let newIndex = 0;

  if (section === "detail" && detailSections.length < 10) {
    sectionType = 'detail';
    const newDetailSection = { id: `detail${detailSections.length + 1}` };
    setDetailSections((prev) => [...prev, newDetailSection]);
    newSection = newDetailSection.id;
    newIndex = detailSections.length + 1;
  } else if (section === "image" && imageSectionCount < 10) {
    sectionType = 'image';
    setImageSectionCount((prevCount) => prevCount + 1);
    newSection = `${sectionType + imageSectionCount + 2}`;
    newIndex = imageSectionCount + 2;
  } else if (section === "text" && textSections.length < 10) {
    sectionType = 'text';
    const newTextSection = { id: `text${textSections.length + 1}` };
    setTextSections((prev) => [...prev, newTextSection]);
    newSection = newTextSection.id;
    newIndex = textSections.length + 1;
  } else if (section === "largeImage" && largeImageSections.length < 10) {
    sectionType = 'largeImage';
    const newLargeImageSection = { id: `largeImage${largeImageSections.length + 1}` };
    setLargeImageSections((prev) => [...prev, newLargeImageSection]);
    newSection = newLargeImageSection.id;
    newIndex = largeImageSections.length + 1;
  } else if (section === "title" && titleSections.length < 10) {
    sectionType = 'title';
    const newTitleSection = { id: `title${titleSections.length + 1}` };
    setTitleSections((prev) => [...prev, newTitleSection]);
    newSection = newTitleSection.id;
    newIndex = titleSections.length + 1;
  }

  if (newSection) {
    setSections((prev) => [...prev, newSection]);
    setSectionOrder((prev) => [...prev, { name: sectionType, index: newIndex }]);
    setImageFiles((prev) => [...prev, []]); // Add empty image files array for the new section
  }
};
  
  

  
  
const handleRemoveField = (section) => {
  if (section !== "main") {
    const sectionType = section.startsWith("image") ? "image" : section.startsWith("detail") ? "detail" : section.startsWith("text") ? "text" : section.startsWith("largeImage") ? "largeImage" : "title";
    const sectionIndex = parseInt(section.replace(`${sectionType}`, ""), 10);

    const updatedSections = sections.filter((s) => s !== section);
    setSections(updatedSections);

    if (sectionType === "image") {
      const updatedImageFiles = [...imageFiles];
      updatedImageFiles.splice(sectionIndex, 1);
      setImageFiles(updatedImageFiles);
      setImageSectionCount((prevCount) => prevCount - 1);
    } else if (sectionType === "detail") {
      setDetailSectionCount((prevCount) => prevCount - 1);
      setDetailSections((prev) => prev.filter((detail) => detail.id !== section));
      setImageFiles((prev) => prev.filter((_, index) => index !== sectionIndex));
    } else if (sectionType === "text") {
      setTextSections((prev) => prev.filter((text) => text.id !== section));
      setTextSectionCount((prevCount) => prevCount - 1);
    } else if (sectionType === "largeImage") {
      setLargeImageSections((prev) => prev.filter((largeImage) => largeImage.id !== section));
      setLargeImageSectionCount((prevCount) => prevCount - 1);
    } else if (sectionType === "title") {
      setTitleSections((prev) => prev.filter((title) => title.id !== section));
      setTitleSectionCount((prevCount) => prevCount - 1);
    }

    setSectionOrder((prev) => prev.filter((s) => s !== section));
  }
};

  


  

  
  
const handleAdd = async (e) => {
  e.preventDefault();

  try {
    const projectData = {
      displayName: data.displayName,
      releaseDate: data.releaseDate,
      videoLink: data.videoLink,
      focusGenre: data.focusGenre,
      videoName: data.videoName,
      projectColor: primaryColor,
      isFeatured: false,
      featuredIndex:null,
      mainDescription1: data.mainDescription1,
      mainDescription2: data.mainDescription2,
      mainFeaturedImage: mainFeaturedImage ? mainFeaturedImage : null,
      timeStamp: serverTimestamp(),
      sectionOrder: sectionOrder,
      featuredOrder:1,
      imageUrls: {},
      details: {},
      textSections: {},
      titleSections: {},
      largeImageSections: {}, 
    };

    if (mainFeaturedImage) {
      const name = new Date().getTime() + mainFeaturedImage.name;
      const storageRef = ref(storage, `mainFeaturedImages/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, mainFeaturedImage);
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    
      // Resize the mainFeaturedImage and generate BlurHash
      const resizedImage = await resizeImage(mainFeaturedImage, 50);
      
      // Upload the resized image to Firebase Storage
      const blurhashName = new Date().getTime() + '-blurhash.jpeg';
      const blurhashStorageRef = ref(storage, `mainFeaturedImages/${blurhashName}`);
      const blurhashUploadTask = uploadBytesResumable(blurhashStorageRef, resizedImage);
      await blurhashUploadTask;
      const blurhashDownloadURL = await getDownloadURL(blurhashUploadTask.snapshot.ref);
    
      projectData.mainFeaturedImage = { url: downloadURL, blurhash: blurhashDownloadURL };
    }
    

   // Initialize the image ID counter
   let imageIdCounter = 1;

   if (mainFeaturedImage) {
     const name = new Date().getTime() + mainFeaturedImage.name;
     const storageRef = ref(storage, `mainFeaturedImages/${name}`);
     const uploadTask = uploadBytesResumable(storageRef, mainFeaturedImage);
     await uploadTask;
     const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

     // Resize the mainFeaturedImage and generate BlurHash
     const resizedImage = await resizeImage(mainFeaturedImage, 50);

     // Upload the resized image to Firebase Storage
     const blurhashName = new Date().getTime() + '-blurhash.jpeg';
     const blurhashStorageRef = ref(storage, `mainFeaturedImages/${blurhashName}`);
     const blurhashUploadTask = uploadBytesResumable(blurhashStorageRef, resizedImage);
     await blurhashUploadTask;
     const blurhashDownloadURL = await getDownloadURL(blurhashUploadTask.snapshot.ref);

     projectData.mainFeaturedImage = { url: downloadURL, blurhash: blurhashDownloadURL };
   }

   // Iterate over image sections and assign stacked IDs
   for (let sectionIndex = 1; sectionIndex <= imageSectionCount + 2; sectionIndex++) {
     const sectionImageUrls = [];

     // Iterate over files in the image section
     for (let fileIndex = 0; fileIndex < imageFiles[sectionIndex - 1].length; fileIndex++) {
       const file = imageFiles[sectionIndex - 1][fileIndex];

       if (file) {
         const name = new Date().getTime() + file.name;

         // Upload the original image to Firebase Storage
         const storageRef = ref(storage, `image${sectionIndex}/${name}`);
         await uploadBytesResumable(storageRef, file);
         const downloadURL = await getDownloadURL(storageRef);

         // Resize the image to 50px width (keeping aspect ratio)
         const resizedImage = await resizeImage(file, 50);

         // Generate BlurHash for the resized image
         const blurhash = await generateBlurHash(resizedImage);

         // Upload the blurhashed image to Firebase Storage with the modified filename
         const blurhashName = new Date().getTime() + '-blurhash.jpeg';
         const blurhashStorageRef = ref(storage, `image${sectionIndex}/${blurhashName}`);
         await uploadBytesResumable(blurhashStorageRef, resizedImage);
         const blurhashDownloadURL = await getDownloadURL(blurhashStorageRef);

         // Assign a stacked ID to the image and push to sectionImageUrls
         sectionImageUrls.push({ id: imageIdCounter++, url: downloadURL, blurhash: blurhashDownloadURL });
       }
     }

     if (sectionImageUrls.length > 0) {
       projectData.imageUrls[`image${sectionIndex - 1}`] = sectionImageUrls;
     }
   }
  


  // For detail sections
  for (const detailSection of detailSections) {
    const detailId = parseInt(detailSection.id.replace('detail', '')); // Extract numeric part and convert to zero-based index
    projectData.details[detailId] = {
      firstDescription: data[`${detailSection.id}-detailsFirstDescription`],
      secondDescription: data[`${detailSection.id}-detailsSecondDescription`],
      title: data[`${detailSection.id}-detailsTitle`],
      featuredImage: {}, // Initialize featuredImage as a map
    };

    // If featured image is not null and is a File, upload and get download URL
    if (imageFiles[detailId]?.featuredImage?.[0]) {
      const file = imageFiles[detailId].featuredImage[0];
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, `featuredImages/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      // Generate and upload blurhash
      const resizedImage = await resizeImage(file, 50);
      const blurhash = await generateBlurHash(resizedImage);

      const blurhashName = new Date().getTime() + '-blurhash.jpeg';
      const blurhashStorageRef = ref(storage, `featuredImages/${blurhashName}`);
      const blurhashUploadTask = uploadBytesResumable(blurhashStorageRef, resizedImage);
      await blurhashUploadTask;
      const blurhashDownloadURL = await getDownloadURL(blurhashUploadTask.snapshot.ref);

      // Update the projectData with the map of URLs
      projectData.details[detailId].featuredImage = {
        url: downloadURL,
        blurhash: blurhashDownloadURL,
      };
    }
  }

    
    
    

    // Iterate over text sections
    for (const textSection of textSections) {

      projectData.textSections[textSection.id] = {
        firstDescription: data[`${textSection.id}-textFirstDescription`],
        secondDescription: data[`${textSection.id}-textSecondDescription`],
      };
    }

    // Iterate over title sections
    for (const titleSection of titleSections) {
      
      projectData.titleSections[titleSection.id] = {
        title: data[`${titleSection.id}-titleTitle`]
      };
    }

 
  // Process largeImage sections
  for (let sectionIndex = 0; sectionIndex <= largeImageSections.length; sectionIndex++) {
    const section = largeImageSections[sectionIndex];

    // Handle the case where imageFiles might not be properly aligned
    if (imageFiles[sectionIndex] && imageFiles[sectionIndex].largeImages) {
      for (let fileIndex = 0; fileIndex <= imageFiles[sectionIndex].largeImages.length; fileIndex++) {
        const file = imageFiles[sectionIndex].largeImages[fileIndex];

        if (file) {
          const name = new Date().getTime() + file.name;
          const storageRef = ref(storage, `largeImages/${name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          await uploadTask;
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          const resizedImage = await resizeImage(file, 50);
          const blurhash = await generateBlurHash(resizedImage);

          const blurhashName = new Date().getTime() + '-blurhash.jpeg';
          const blurhashStorageRef = ref(storage, `largeImages/${blurhashName}`);
          const blurhashUploadTask = uploadBytesResumable(blurhashStorageRef, resizedImage);
          await blurhashUploadTask;
          const blurhashDownloadURL = await getDownloadURL(blurhashUploadTask.snapshot.ref);

          if (!projectData.largeImageSections[sectionIndex]) {
            projectData.largeImageSections[sectionIndex] = [];
          }

          projectData.largeImageSections[sectionIndex].push({
            largeImage: downloadURL,
            blurhash: blurhashDownloadURL
          });
        }
      }
    }
  }
    
    if(title === 'Reference Peace'){
      const projectDocRef = doc(db, "referencePeace", data.displayName);
      await setDoc(projectDocRef, projectData);
    }else{
      const projectDocRef = doc(db, "projects", data.displayName);
      await setDoc(projectDocRef, projectData);
    }
  

    navigate(-1);
  } catch (err) {
    console.error(err);
  }
};
    
  
const resizeImage = async (file, width) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scaleFactor = width / img.width;
        canvas.width = width;
        canvas.height = img.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert the resized image to a Blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.9);
      };
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
};

const generateBlurHash = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        // Get the image data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Encode BlurHash from the image data
        const blurhash = encode(imageData.data, imageData.width, imageData.height, 4, 3);
        resolve(blurhash);
      };
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
};
  
  
  
  // Function to create a valid class name from the label
  const getClassNameFromLabel = (label) => {
    return label.replace(/\s+/g, '').toLowerCase();
  };


  const getInitialSections = () => {
    return ["main", 'image0', ...Array.from({ length: imageSectionCount }, (_, i) => `image${i + 1}`)];
  };

  const initialSections = getInitialSections();

  useEffect(() => {
    dispatch({ type: "Small" });

    return () => {
      dispatch({ type: "Default" });
    };
  }, [dispatch]);

const handleFileChange = (sectionIndex, imageIndex, file, isFeatured) => {
  const updatedImageFiles = [...imageFiles];


// If the section doesn't exist in updatedImageFiles, initialize it
if (!updatedImageFiles[sectionIndex]) {
  updatedImageFiles[sectionIndex] = {};
}

// Set the correct image property based on isFeatured
if (isFeatured) {
  updatedImageFiles[sectionIndex].featuredImage = [file];
} else {
  updatedImageFiles[sectionIndex].largeImages = [file];
}

// Update the imageFiles state
setImageFiles(updatedImageFiles);
};
  

  

  
  


return (
  <div className="new">
    <div className="all-projects-page-wrap">
      <div className="project-sidebar">
        <div className="sidebar-top"></div>
        <div className="sidebar-middle">
          {sectionOrder && setSectionOrder &&
           <DragList sectionOrder={sectionOrder} setSectionOrder={setSectionOrder}/>
          }
         
        </div>
        <div className="sidebar-bottom">
          <MainHero />
          <Masonry />

          <FiftyFifty />
          <LargeImage />
          <Text />
          <Title />
        </div>
      </div>
      <div className="add-projects-content">
        <div className={`add-projects-list`}>
          <form onSubmit={handleAdd}>
          

<div>
{mainFeaturedImage && (
  <div className='uploaded-image-wrap'>
    <img
      src={URL.createObjectURL(mainFeaturedImage)}
      alt="main-featured-image"
      className="uploaded-image-preview"
    />
    <p className='body'><span>*</span>Keep in mind the featured image will be viewed in variable dimensions, Aim to keep subject matter centered appropriately</p>
    </div>

  )}
  <div className={`section-title ${mainFeaturedImage && 'image-preview'}`}>Main Section</div>
  <div className="formInput projectname">
    <label>Project Name</label>
    <input
      id='displayName'
      type="text"
      placeholder='domengo'
      onChange={handleInput}
      required
    />
  </div>
  <div className="formInput projectColor">
    <label>Project Color</label>
    <input id='projectColour' type="color" value={primaryColor} onChange={handleColorChange} />
  </div>
  <div className="formInput projectImage">
    <label>Featured Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setMainFeaturedImage(e.target.files[0])}
    />
  </div>
  {projectMainSection.map((input) => (
    <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
      <label>{input.label}</label>
      <input
        id={input.id}
        type={input.type}
        placeholder={input.placeholder}
        onChange={handleInput}
        maxLength={input.maxLength || null}
        required
      />
    </div>
  ))}

 
</div>
<div className="uploaded-section-wrap detail-section">
  {/* {detailSections.map((detailSection, index) => (
    <div key={detailSection.id} className={detailSection.id}>
      <div className="section-title">{`Detail Section ${index + 1}`}</div>

      <div className="formInput">
        <label>Upload Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(index, 0, e.target.files[0], true)}

        />
      </div>
      {imageFiles[index]?.featuredImage && (
        <img
          src={URL.createObjectURL(imageFiles[index].featuredImage[0])}
          alt="featured-image"
          className="uploaded-image-preview"
        />
      )}

      {projectDetailSection.map((input) => (
        <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
          <label>{input.label}</label>
          <input
            id={`${detailSection.id}-${input.id}`}
            type={input.type}
            placeholder={input.placeholder}
            onChange={handleInput}
            maxLength={input.maxLength || null}
            required
          />
        </div>
      ))}

      <button type="button" onClick={() => handleRemoveField(detailSection.id)}>
        Remove Detail Section {index + 1}
      </button>
    </div>
  ))} */}
</div>




{sectionOrder.map((section, index) => {
  if (section.name === 'main') {
    // Render main section here
    return (
      <div key={`main-${index}`}>
        {/* Your main section JSX */}
      </div>
    );
  } else if (section.name === 'detail') {
    const detailSection = detailSections.find((detail) => detail.id === `detail${section.index}`);
    if (detailSection) {
      // Render detail section here
      return (
        <div key={`detail-${section.index}`}>
          <div className={detailSection.id}>
            <div className="section-title">{`Detail Section ${section.index}`}</div>
            <div className="formInput">
              <label>Upload Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(section.index, 0, e.target.files[0], true)}
              />
            </div>
            {imageFiles[section.index]?.featuredImage && (
              <img
                src={URL.createObjectURL(imageFiles[section.index].featuredImage[0])}
                alt="featured-image"
                className="uploaded-image-preview"
              />
            )}
            {projectDetailSection.map((input) => (
              <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
                <label>{input.label}</label>
                <input
                  id={`detail${section.index}-${input.id}`}
                  type={input.type}
                  placeholder={input.placeholder}
                  onChange={handleInput}
                  maxLength={input.maxLength || null}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={() => handleRemoveField(detailSection.id)}>
              Remove Detail Section {section.index}
            </button>
          </div>
        </div>
      );
    }
  }
 else if (section.name === 'image') {
    const imageSection = initialSections.find((init) => init === `image${section.index -1}`);
    if (imageSection) {
      // Render image section here
      return (
        <div className='uploaded-image-section-wrap'>

 
        <div className="body image-section-title" key={`image-${section.index}`}>
          <span>Image Section {section.index}</span>

          <div className={`image-section-${section.index}`}>
            {[...Array(24)].map((_, index) => (
              <div
                key={index}
                className={`image-section ${index === dragOverSection ? 'drag-over' : ''} list-map-wrap`}
                onDragEnter={() => handleDragEnter(section.index)}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, section.index, index)}
              >
                <div>
                  <input
                    type="file"
                    id={`file-${section.index}-${index}`}
                    onChange={(e) => handleFileChange(section.index, index, e.target.files[0])}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                  <label htmlFor={`file-${section.index}-${index}`} className="file-label primary-button">
                    <span>image {index + 1}</span>
                  </label>
                </div>

                <img
                  src={
                    imageFiles[section.index] && imageFiles[section.index][index]
                      ? URL.createObjectURL(imageFiles[section.index][index])
                      : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
                  }
                  alt="uploaded-image"
                  className="map-image-upload-thumb"
                />
              </div>
            ))}
            {/* Add a button to remove the image section */}
            <button type="button" onClick={() => handleRemoveField(`image${section.index}`)}>
              Remove Image Section {section.index}
            </button>
          </div>
        </div>
        </div>
      );
    }
  } else if (section.name === 'text') {
    const textSection = textSections.find((text) => text.id === `text${section.index}`);
    if (textSection) {
      // Render text section here
      return (
        <div key={`text-${section.index}`}>
          <div className="section-wrap">
            <div className="section-title">{`Text Section ${section.index}`}</div>
            {textSectionSource.map((input) => (
              <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
                <label>{input.label}</label>
                <input
                  id={`text${section.index}-${input.id}`}
                  type={input.type}
                  placeholder={input.placeholder}
                  onChange={handleInput}
                  maxLength={input.maxLength || null}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={() => handleRemoveField(textSection.id)}>
              Remove Text Section {section.index}
            </button>
          </div>
        </div>
      );
    }
  }
   else if (section.name === 'largeImage') {
    const largeImageSection = largeImageSections.find((largeImage) => largeImage.id === `largeImage${section.index}`);
    if (largeImageSection) {
      // Render large image section here
      return (
        <div key={`largeImage-${section.index}`}>
          <div className="section-wrap">
            <div className="section-title">{`Large Image Section ${section.index}`}</div>
            <div className="formInput">
              <label>Upload Large Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(section.index, 0, e.target.files[0], false)}
              />
            </div>
            {imageFiles[section.index]?.largeImages?.[0] && (
              <img
                src={URL.createObjectURL(imageFiles[section.index].largeImages[0])}
                alt="large-image"
                className="uploaded-image-preview"
              />
            )}
            <button type="button" onClick={() => handleRemoveField(largeImageSection.id)}>
              Remove Large Image Section {section.index}
            </button>
          </div>
        </div>
      );
    }  
  } else if (section.name === 'title') {
    const titleSection = titleSections.find((title) => title.id === `title${section.index}`);
    if (titleSection) {
      // Render title section here
      return (
        <div key={`title-${section.index}`}>
          <div className="section-title">{`Title Section ${section.index}`}</div>
          {titleSectionSource.map((input) => (
            <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
              <label>{input.label}</label>
              <input
                id={`title${section.index}-${input.id}`}
                type={input.type}
                placeholder={input.placeholder}
                onChange={handleInput}
                maxLength={input.maxLength || null}
                required
              />
            </div>
          ))}
          <button type="button" onClick={() => handleRemoveField(titleSection.id)}>
            Remove Title Section {section.index}
          </button>
        </div>
      );
    }
  }
  
})}



            <div className="add-button-grid">
              <button
                type="button"
                onClick={() => handleAddField('detail')}
                disabled={sections.includes('detail')}
              >
                <FiftyFifty/>
                Add Detail Section
              </button>

              <button
                type="button"
                onClick={() => handleAddField('image')}
                disabled={sections.includes('image') || imageSectionCount === 10}
              >
             
                <Masonry/>
                Add Image Section
              </button>

              <button
                type="button"
                onClick={() => handleAddField('text')}
                disabled={sections.includes('text') || imageSectionCount === 10}
              >
                <Text/>
                Add Text Section
              </button>

              <button
                type="button"
                onClick={() => handleAddField('largeImage')}
                disabled={sections.includes('largeImage') || imageSectionCount === 10}
              >
                <LargeImage/>
                Add Large Image Section
              </button>

              <button
                type="button"
                onClick={() => handleAddField('title')}
                disabled={sections.includes('title') || imageSectionCount === 10}
              >
                <Title/>
                Add Title Section
              </button>
            </div>

             <button disabled={perc != null && perc < 100} type="submit" className='submit-project'>
              <span>
              Send
              </span>
              
            </button>
            {perc}
          </form>
        </div>
      </div>
    </div>
  </div>
); 
};


const DragList = ({ sectionOrder, setSectionOrder }) => {

  const onDragEnd = result => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSectionOrder(items);
  };

  return (
    <div className='drag-list'>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {sectionOrder.map((item, index) => (
              <React.Fragment key={index}>
                {index === 0 ? (
                  <div className='drag-item non-drag'>
                    {/* Render your non-draggable content here */}
                    <div className='body'>{item.name || item} {item.index || null}</div>
                  </div>
                ) : (
                  <Draggable draggableId={`item-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className='drag-item'
                      >
                        {/* Render your draggable section content here */}
                        <div className='body'>{item.name || item} {item.index || null}</div>
                      </div>
                    )}
                  </Draggable>
                )}
              </React.Fragment>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </div>
  );
};



export default AddProject;