import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../../../../firebase/firebase";
import { useFooter } from "../../../../../context/FooterContext";
import { projectMainSection, projectDetailSection, textSectionSource, titleSectionSource } from '../../formSource';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { encode } from 'blurhash';
import MainHero from "../SVG/MainHeroSVG";
import FiftyFifty from "../SVG/fiftyfiftySVG";
import LargeImage from "../SVG/LargeImageSVG";
import Masonry from "../SVG/MasonrySVG";
import Text from "../SVG/TextSVG";
import Title from "../SVG/TitleSVG";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const UpdateProject = ({ inputs, title }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
  const [perc, setPerc] = useState(null);
  const [data, setData] = useState({});
  const [sections, setSections] = useState([]);
  const [imageSectionCount, setImageSectionCount] = useState(0);
  const [detailSectionCount, setDetailSectionCount] = useState(0);
  const [textSectionCount, setTextSectionCount] = useState(0);
  const [titleSectionCount, setTitleSectionCount] = useState(0);
  const [largeImageSectionCount, setLargeImageSectionCount] = useState(0);
  const [sectionOrder, setSectionOrder] = useState([]);
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


  

  useEffect(() => {
    const fetchProjectData = async () => {
      const projectRef = doc(db, title === 'Reference Peace' ? "referencePeace" : "projects", projectId);
      const projectSnap = await getDoc(projectRef);

      if (projectSnap.exists()) {
        const projectData = projectSnap.data();
        setData(projectData);
        setPrimaryColor(projectData.projectColor || '#0000FF');
        setSectionOrder(projectData.sectionOrder || []);
        setDetailSections(projectData.details ? Object.keys(projectData.details).map(key => ({ id: key })) : []);
        setTextSections(projectData.textSections ? Object.keys(projectData.textSections).map(key => ({ id: key })) : []);
        setTitleSections(projectData.titleSections ? Object.keys(projectData.titleSections).map(key => ({ id: key })) : []);
        setLargeImageSections(projectData.largeImageSections ? Object.keys(projectData.largeImageSections).map(key => ({ id: key })) : []);
        setImageSectionCount(projectData.imageUrls ? Object.keys(projectData.imageUrls).length : 0);
      } else {
        console.log("No such document!");
      }
    };

    fetchProjectData();
  }, [projectId, title]);

  const handleColorChange = (event) => {
    setPrimaryColor(event.target.value);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--project-color', primaryColor);
  }, [primaryColor]);

  const handleInput = (e) => {
    const { id, value } = e.target;
  
    // Use the id to directly update the corresponding part of the data object
    setData((prevData) => ({
      ...prevData,
      [id]: value, // Dynamically set the state by id
    }));
  };
  


  const handleDragEnter = (sectionIndex) => {
    setDragOverSection(sectionIndex);
  };

  const handleDragLeave = () => {
    setDragOverSection(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, sectionIndex, index) => {
      e.preventDefault();
      setDragOverSection(null);

      const files = e.dataTransfer.files;
      const filesArray = Array.from(files).slice(0, Math.min(files.length, 25 - index));

      const updatedImageFiles = [...imageFiles];

      // Ensure the section exists
      if (!updatedImageFiles[sectionIndex]) {
          updatedImageFiles[sectionIndex] = [];
      }

      // Add the files starting from the dropped position
      filesArray.forEach((file, i) => {
          if (index + i < 25) {
              updatedImageFiles[sectionIndex][index + i] = file;
          }
      });

      // Update the imageFiles state
      setImageFiles(updatedImageFiles);
  };


  const handleAddField = (section) => {
    let newSection = "";
    let sectionType = '';
    let newIndex = 0;

    console.log(sectionOrder);

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
      const newLargeImageSection = { id: `${largeImageSections.length + 1}` };
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
      setImageFiles((prev) => [...prev, []]);
    }
  };

  const handleRemoveField = (section) => {
    if (section !== "main") {
      const sectionType = section.startsWith("image")
        ? "image"
        : section.startsWith("detail")
        ? "detail"
        : section.startsWith("text")
        ? "text"
        : section.startsWith("largeImage")
        ? "largeImage"
        : "title";

      const sectionIndex = parseInt(section.replace(`${sectionType}`, ""), 10);

      setSections((prev) => prev.filter((s) => s !== section));

      if (sectionType === "image") {
        setImageFiles((prev) => prev.filter((_, index) => index !== sectionIndex));
        setImageSectionCount((prevCount) => prevCount - 1);
      } else if (sectionType === "detail") {
        setDetailSections((prev) => prev.filter((detail) => detail.id !== section));
        setDetailSectionCount((prevCount) => prevCount - 1);

        setImageFiles((prev) => {
          const updatedImageFiles = [...prev];

          // Only clear the featuredImage field for the specific detail section
          if (updatedImageFiles[sectionIndex]?.featuredImage) {
            updatedImageFiles[sectionIndex] = {
              ...updatedImageFiles[sectionIndex], // Preserve other images
              featuredImage: null, // Only reset featuredImage, leave other images intact
            };
          }

          return updatedImageFiles;
        });
      }            
       else if (sectionType === "text") {
        setTextSections((prev) => prev.filter((text) => text.id !== section));
        setTextSectionCount((prevCount) => prevCount - 1);
      } else if (sectionType === "largeImage") {
        setLargeImageSections((prev) =>
          prev.filter((largeImage) => largeImage.id !== section)
        );
        setLargeImageSectionCount((prevCount) => prevCount - 1);
      } else if (sectionType === "title") {
        setTitleSections((prev) => prev.filter((title) => title.id !== section));
        setTitleSectionCount((prevCount) => prevCount - 1);
      }

      setSectionOrder((prev) =>
        prev.filter(
          (s) =>
            !(
              typeof s === "object" &&
              s.name === sectionType &&
              s.index === sectionIndex
            )
        )
      );
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const projectData = {
        displayName: data.displayName,
        releaseDate: data.releaseDate,
        videoLink: data.videoLink,
        focusGenre: data.focusGenre,
        videoName: data.videoName,
        role: data.role,
        projectColor: primaryColor,
        isFeatured: data.isFeatured || false,
        featuredIndex: data.featuredIndex || null,
        mainDescription1: data.mainDescription1,
        mainDescription2: data.mainDescription2,
        mainFeaturedImage: mainFeaturedImage ? mainFeaturedImage : data.mainFeaturedImage,
        timeStamp: serverTimestamp(),
        sectionOrder: sectionOrder,
        featuredOrder: data.featuredOrder || 1,
        imageUrls: data.imageUrls || {},
        details: data.details || {},
        textSections: data.textSections || {},
        titleSections: data.titleSections || {},
        largeImageSections: data.largeImageSections || {},
      };


      const updatedDetails = { ...data.details };


      if (mainFeaturedImage) {
        const name = new Date().getTime() + mainFeaturedImage.name;
        const storageRef = ref(storage, `mainFeaturedImages/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, mainFeaturedImage);
        await uploadTask;
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        const resizedImage = await resizeImage(mainFeaturedImage, 50);
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
        const blurhashName = new Date().getTime() + "-blurhash.jpeg";
        const blurhashStorageRef = ref(
          storage,
          `mainFeaturedImages/${blurhashName}`
        );
        const blurhashUploadTask = uploadBytesResumable(
          blurhashStorageRef,
          resizedImage
        );
        await blurhashUploadTask;
        const blurhashDownloadURL = await getDownloadURL(
          blurhashUploadTask.snapshot.ref
        );

        projectData.mainFeaturedImage = {
          url: downloadURL,
          blurhash: blurhashDownloadURL,
        };
      }

      for (let sectionIndex = 1; sectionIndex <= imageSectionCount + 2; sectionIndex++) {
        const sectionImageUrls = [];

        // Retrieve the current images for the section (from existing data)
        const currentImages = data.imageUrls[`image${sectionIndex - 1}`] || [];

        // Iterate over files in the image section (the newly uploaded images)
        for (let fileIndex = 0; fileIndex < imageFiles[sectionIndex - 1].length; fileIndex++) {
          const file = imageFiles[sectionIndex - 1][fileIndex];

          // If the file is new or different from the existing one, process it
          if (file) {
            // Check if the image file at this index has changed (you could also check other properties like size)
            const existingImage = currentImages[fileIndex];

            if (!existingImage || existingImage.url !== file.name) {  // Compare with the existing image
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
              const blurhashName = new Date().getTime() + "-blurhash.jpeg";
              const blurhashStorageRef = ref(storage, `image${sectionIndex}/${blurhashName}`);
              await uploadBytesResumable(blurhashStorageRef, resizedImage);
              const blurhashDownloadURL = await getDownloadURL(blurhashStorageRef);

              // Assign a stacked ID to the image and push to sectionImageUrls
              sectionImageUrls.push({
                id: imageIdCounter++,
                url: downloadURL,
                blurhash: blurhashDownloadURL,
              });
            } else {
              // If the image is unchanged, keep the current URL
              sectionImageUrls.push(existingImage);
            }
          } else {
            // If no file is uploaded, keep the existing images
            sectionImageUrls.push(...currentImages);
          }
        }

        if (sectionImageUrls.length > 0) {
          projectData.imageUrls[`image${sectionIndex - 1}`] = sectionImageUrls;
        }
      }
      



      
      // Iterate over text sections
      for (const textSection of textSections) {
        const sectionData = data[`${textSection.id}-textFirstDescription`]; // Get the data from the form
        const sectionSecondData = data[`${textSection.id}-textSecondDescription`];

        const currentFirstDescription = projectData.textSections?.[textSection.id]?.firstDescription;
        const currentSecondDescription = projectData.textSections?.[textSection.id]?.secondDescription;
        const updatedTextSection = {};

        if (sectionData !== currentFirstDescription) {
          updatedTextSection.firstDescription = sectionData || currentFirstDescription; // Use current if empty
        }

        if (sectionSecondData !== currentSecondDescription) {
          updatedTextSection.secondDescription = sectionSecondData || currentSecondDescription; // Use current if empty
        }

        if (Object.keys(updatedTextSection).length > 0) {
          projectData.textSections[textSection.id] = {
            ...projectData.textSections[textSection.id],
            ...updatedTextSection,
          };
        }
      }

      for(const titleSection of titleSections) {
        const sectionData = data[`${titleSection.id}-titleTitle`];
        
        const currentTitle = projectData.titleSections?.[titleSection.id]?.title;
        const updatedTitleSection = {};

        if (sectionData !== currentTitle) {
          updatedTitleSection.title = sectionData || currentTitle;
        }

        if (Object.keys(updatedTitleSection).length > 0) {
          projectData.titleSections[titleSection.id] = {
            ...projectData.titleSections[titleSection.id],
            ...updatedTitleSection,
          };
        }
      }

      for(const detailSection of detailSections) {
        const sectionData = data[`${detailSection.id}-detailsTitle`];
        const sectionFirstData = data[`${detailSection.id}-detailsFirstDescription`];
        const sectionSecondData = data[`${detailSection.id}-detailsSecondDescription`];

        const currentTitle = projectData.details?.[detailSection.id]?.title;
        const currentFirstDescription = projectData.details?.[detailSection.id]?.firstDescription;
        const currentSecondDescription = projectData.details?.[detailSection.id]?.secondDescription;
        const updatedDetailSection = {};

        if (sectionData !== currentTitle) {
          updatedDetailSection.title = sectionData || currentTitle;
        }

        if (sectionFirstData !== currentFirstDescription) {
          updatedDetailSection.firstDescription = sectionFirstData || currentFirstDescription;
        }

        if (sectionSecondData !== currentSecondDescription) {
          updatedDetailSection.secondDescription = sectionSecondData || currentSecondDescription;
        }

        if (Object.keys(updatedDetailSection).length > 0) {
          projectData.details[detailSection.id] = {
            ...projectData.details[detailSection.id],
            ...updatedDetailSection,
          };
        }
      }
      
      
      
      
      





      const projectRef = doc(db, title === 'Reference Peace' ? "referencePeace" : "projects", projectId);
      await updateDoc(projectRef, projectData);

      setIsUploading(false);
      navigate(-1);
    } catch (err) {
      setIsUploading(false);
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

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const blurhash = encode(imageData.data, imageData.width, imageData.height, 4, 3);
          resolve(blurhash);
        };
      };

      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(file);
    });
  };

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

      // Ensure the section exists
      if (!updatedImageFiles[sectionIndex]) {
          updatedImageFiles[sectionIndex] = [];
      }

      // Ensure the imageIndex is within bounds
      if (imageIndex !== null && imageIndex >= 0 && imageIndex < 25) {
          updatedImageFiles[sectionIndex][imageIndex] = file;
      } else if (isFeatured) {
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
              <DragList sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} />
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
            <form onSubmit={handleUpdate} className={`${isUploading ? 'uploading': ''}`}>
              <div>
                
              {(data.mainFeaturedImage || mainFeaturedImage) && (
                  <div className='uploaded-image-wrap'>
                    <img
                      src={mainFeaturedImage ? URL.createObjectURL(mainFeaturedImage) : data.mainFeaturedImage.url}
                      alt="main-featured-image"
                      className="uploaded-image-preview"
                    />
                    <p className='body'>
                      <span>*</span>Keep in mind the featured image will be viewed in variable dimensions, Aim to keep subject matter centered appropriately
                    </p>
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
                    defaultValue={data.displayName || ''}
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
                    defaultValue={data.featuredImage}
                  />
                </div>
                
                {projectMainSection.map((input) => (
                  <>
           
                    <div className={`formInput map ${getClassNameFromLabel(input.label)}`} key={input.id}>
                    <label>{input.label}</label>
                    <div>
                      <input
                        id={input.id}
                        type={input.type}
                        placeholder={input.placeholder}
                        onChange={handleInput}
                        defaultValue={data[input.id] || ''}
                        maxLength={input.maxLength || null}
                        required
                      />
                      {input.id != "role" ? (
                        <></>
                      ):(
                        <span className="body">By Max Dona</span>
                      )}

                    </div>
                    
                  </div>
                 
                  </>
                  
                ))}
              </div>

              <div className="uploaded-section-wrap detail-section">
                {detailSections.map((detailSection, index) => (
                  <div key={detailSection.id} className={detailSection.id}>
                    <div className="section-title">{`Detail Section ${index + 1}`}</div>
                    <div className="formInput">
                      <label>Upload Featured Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, null, e.target.files[0], true)}
                      />
                    </div>
                    {(imageFiles[index]?.featuredImage && imageFiles[index].featuredImage.length > 0) || data.details[index + 1]?.featuredImage?.url ? (
                      <img
                        src={
                          imageFiles[index]?.featuredImage?.length > 0
                            ? URL.createObjectURL(imageFiles[index].featuredImage[0])
                            : data.details[index + 1]?.featuredImage?.url
                        }
                        alt="featured-image"
                        className="uploaded-image-preview"
                      />
                    ) : null}

                    {projectDetailSection.map((input) => {
                      const detailKey = input.id.replace('details', '');
                      const formattedKey = detailKey.charAt(0).toLowerCase() + detailKey.slice(1);

                      return(
                      <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
                        <label>{input.label}</label>
                        
                        <input
                          id={`${detailSection.id}-${input.id}`}
                          type={input.type}
                          placeholder={input.placeholder}
                          onChange={handleInput}
                          defaultValue={data.details[index + 1]?.[formattedKey] || ''}
                          maxLength={input.maxLength || null}
                          required
                        />
                      </div>
                    )})}
                    <button type="button" onClick={() => handleRemoveField(detailSection.id)}>
                      Remove Detail Section {index + 1}
                    </button>
                  </div>
                ))}
              </div>

              {sectionOrder.map((section, index) => {
                if (section.name === 'main') {
                  return (
                    <div key={`main-${index}`}>
                      {/* Render main section here */}
                    </div>
                  );
                } else if (section.name === 'detail') {
                  const detailSection = detailSections.find((detail) => detail.id === `detail${section.index}`);
                  if (detailSection) {
                    return (
                      <div key={`detail-${section.index}`}>
                        <div className={detailSection.id}>
                          <div className="section-title">{`Detail Section ${section.index}`}</div>
                          <div className="formInput">
                            <label>Upload Featured Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(section.index, null, e.target.files[0], true)}
                            />
                          </div>
                          {imageFiles[section.index]?.featuredImage && (
                            <img
                              src={URL.createObjectURL(imageFiles[section.index].featuredImage[0])}
                              alt="featured-image"
                              className="uploaded-image-preview"
                            />
                          )}
                          {projectDetailSection.map((input) => {
                            const detailKey = input.id.replace('details', '');
                            const formattedKey = detailKey.charAt(0).toLowerCase() + detailKey.slice(1);

                            return (
                            <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
                              <label>{input.label}</label>
                              <input
                                id={`detail${section.index}-${input.id}`}
                                type={input.type}
                                placeholder={input.placeholder}
                                onChange={handleInput}
                                defaultValue={data.details[index + 1]?.[formattedKey] || ''}
                                maxLength={input.maxLength || null}
                                required
                              />
                            
                            </div>
                          )})}
                          <button type="button" onClick={() => handleRemoveField(detailSection.id)}>
                            Remove Detail Section {section.index}
                          </button>
                        </div>
                      </div>
                    );
                  }
                } else if (section.name === 'image') {
                  const imageSection = initialSections.find((init) => init === `image${section.index - 1}`);
                  if (imageSection) {
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

                                {/* Only one <img> to display the correct image */}
                                <img
                                  src={
                                    imageFiles[section.index] && imageFiles[section.index][index]
                                      ? URL.createObjectURL(imageFiles[section.index][index]) // Show uploaded image
                                      : data.imageUrls && data.imageUrls[`image${section.index}`]?.[index]?.url
                                      ? data.imageUrls[`image${section.index}`][index].url // Show image from data
                                      : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg' // Default to no-image-icon
                                  }
                                  alt="uploaded-image"
                                  className="map-image-upload-thumb"
                                />
                              </div>
                            ))}
                            <button type="button" onClick={() => handleRemoveField(`image${section.index}`)}>
                              Remove Image Section {section.index}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }
                
                 else if (section.name === 'text') {
                  const textSection = textSections.find((text) => text.id === `text${section.index}`);
                  if (textSection) {
                    return (
                      <div key={`text-${section.index}`}>
                        <div className="section-wrap">
                          <div className="section-title">{`Text Section ${section.index}`}</div>
                          {textSectionSource.map((input) => {
                            const textKey = input.id.replace('text', '');
                            const formattedKey = textKey.charAt(0).toLowerCase() + textKey.slice(1);

                            return(
                            <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
                              <label>{input.label}</label>
                              <input
                                id={`text${section.index}-${input.id}`}
                                type={input.type}
                                placeholder={input.placeholder}
                                onChange={handleInput}
                                defaultValue={data.textSections[textSection.id]?.[formattedKey] || ''}
                                maxLength={input.maxLength || null}
                                required
                              />
                            </div>
                          )})}
                          <button type="button" onClick={() => handleRemoveField(textSection.id)}>
                            Remove Text Section {section.index}
                          </button>
                        </div>
                      </div>
                    );
                  }
                } else if (section.name === 'largeImage') {
                  const largeImageSection = largeImageSections.find(
                    (largeImage) => largeImage.id === `${section.index}`
                  );
                  
                  console.log("section.index:", section.index);
                  console.log("largeImageSections:", largeImageSections);
                  console.log("largeImageSection:", largeImageSection);
                  if (largeImageSection) {
                    return (
                      <div key={`largeImage-${section.index}`}>
                        <div className="section-wrap">
                          <div className="section-title">{`Large Image Section ${section.index}`}</div>
                          <div className="formInput">
                            <label>Upload Large Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(section.index, null, e.target.files[0], false)}
                            />
                          </div>
                          {(imageFiles[section.index]?.largeImages?.length > 0) || data.largeImageSections[section.index]?.[0]?.largeImage ? (
                            <img
                              src={
                                imageFiles[section.index]?.largeImages?.length > 0
                                  ? URL.createObjectURL(imageFiles[section.index].largeImages[0]) 
                                  : data.largeImageSections[section.index]?.[0]?.largeImage
                              }
                              alt="large-image"
                              className="uploaded-image-preview"
                            />
                          ) : null}

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
                             defaultValue={data.titleSections?.[`title${section.index}`]?.title || ''}
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
                  <FiftyFifty />
                  Add Detail Section
                </button>

                <button
                  type="button"
                  onClick={() => handleAddField('image')}
                  disabled={sections.includes('image') || imageSectionCount === 10}
                >
                  <Masonry />
                  Add Image Section
                </button>

                <button
                  type="button"
                  onClick={() => handleAddField('text')}
                  disabled={sections.includes('text') || imageSectionCount === 10}
                >
                  <Text />
                  Add Text Section
                </button>

                <button
                  type="button"
                  onClick={() => handleAddField('largeImage')}
                  disabled={sections.includes('largeImage') || imageSectionCount === 10}
                >
                  <LargeImage />
                  Add Large Image Section
                </button>

                <button
                  type="button"
                  onClick={() => handleAddField('title')}
                  disabled={sections.includes('title') || imageSectionCount === 10}
                >
                  <Title />
                  Add Title Section
                </button>
              </div>

              <button disabled={perc != null && perc < 100} type="submit" className='submit-project'>
                <span>{isUploading ? 'Updating': 'Update'}</span>
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

export default UpdateProject;