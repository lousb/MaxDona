import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../../../../firebase/firebase";
import { useFooter } from "../../../../../context/FooterContext";
import { projectMainSection, projectDetailSection, imageSection } from '../../formSource';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { encode } from 'blurhash';

const AddProject = ({ inputs, title }) => {
  const [perc, setPerc] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [sections, setSections] = useState(["main"]);
  const [imageSectionCount, setImageSectionCount] = useState(0);
  const [detailSectionCount, setDetailSectionCount] = useState(0);
  const [file, setFile] = useState("");
  const { dispatch } = useFooter();
  const [imageFiles, setImageFiles] = useState(Array.from({ length: 25 }, () => []));
  const [detailSections, setDetailSections] = useState([]);
  const [dragOverSection, setDragOverSection] = useState(null);
  const [mainFeaturedImage, setMainFeaturedImage] = useState(null);

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
            console.log('Upload is ' + progress + '% done');
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
    if (section === "detail" && detailSections.length < 3) {
      const newDetailSection = { id: `detail${detailSections.length + 1}` };
      setDetailSections((prev) => [...prev, newDetailSection]);
      setSections((prev) => [...prev, newDetailSection.id]);
      setImageFiles((prev) => [...prev, []]); // Add empty image files array for the new detail section
    } else if (section === "image" && imageSectionCount < 3) {
      setImageSectionCount((prevCount) => prevCount + 1);
      setSections([...sections, `image${imageSectionCount + 1}`]);
      setImageFiles((prev) => [...prev, []]); // Add empty image files array for the new image section
    }
  };
  
  
  const handleRemoveField = (section) => {
    if (section !== "main") {
      const sectionType = section.startsWith("image") ? "image" : "detail";
      const sectionIndex = parseInt(section.replace(`${sectionType}`, ""), 10);
  
      const updatedSections = sections.filter((s) => s !== section);
      setSections(updatedSections);
  
      if (sectionType === "image") {
        // Remove the image files for this section by splicing the imageFiles array
        const updatedImageFiles = [...imageFiles];
        updatedImageFiles.splice(sectionIndex, 1);
        setImageFiles(updatedImageFiles);
  
        setImageSectionCount((prevCount) => prevCount - 1);
      } else if (sectionType === "detail") {
        setDetailSectionCount((prevCount) => prevCount - 1);
        setDetailSections((prev) => prev.filter((detail) => detail.id !== section));
        setImageFiles((prev) => prev.filter((_, index) => index !== sectionIndex)); // Remove image files for the removed detail section
      }
    }
  };
  
  
  
const handleAdd = async (e) => {
  e.preventDefault();

  try {
    const projectData = {
      displayName: data.displayName,
      releaseDate: data.releaseDate,
      videoLink: data.videoLink,
      videoName: data.videoName,
      mainDescription1: data.mainDescription1,
      mainDescription2: data.mainDescription2,
      mainFeaturedImage: mainFeaturedImage ? mainFeaturedImage : null,
      timeStamp: serverTimestamp(),
      imageUrls: {},
      details: {},
    };

    if (mainFeaturedImage) {
      const name = new Date().getTime() + mainFeaturedImage.name;
      const storageRef = ref(storage, `mainFeaturedImages/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, mainFeaturedImage);
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      projectData.mainFeaturedImage = downloadURL;
    }

    // Iterate over image sections
    for (let sectionIndex = 1; sectionIndex <= imageSectionCount + 1; sectionIndex++) {
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

          sectionImageUrls.push({ url: downloadURL, blurhash: blurhashDownloadURL });
        }
      }

      if (sectionImageUrls.length > 0) {
        projectData.imageUrls[`image${sectionIndex}`] = sectionImageUrls;
      }
    }

    for (let index = 0; index < detailSections.length; index++) {
      const detailSection = detailSections[index];
      projectData.details[detailSection.id] = {
        firstDescription: data[`${detailSection.id}-detailsFirstDescription`],
        secondDescription: data[`${detailSection.id}-detailsSecondDescription`],
        title: data[`${detailSection.id}-detailsTitle`],
        featuredImage: imageFiles[index]?.featuredImage ? imageFiles[index]?.featuredImage : null,
      };

      // If featured image is a File, upload and get download URL
      if (projectData.details[detailSection.id].featuredImage instanceof File) {
        const name = new Date().getTime() + projectData.details[detailSection.id].featuredImage.name;
        const storageRef = ref(storage, `featuredImages/${name}`);
        const uploadTask = uploadBytesResumable(storageRef, projectData.details[detailSection.id].featuredImage);
        await uploadTask;
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        projectData.details[detailSection.id].featuredImage = downloadURL;
      }
    }

    const projectDocRef = doc(db, "projects", data.displayName);
    await setDoc(projectDocRef, projectData);

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
  
  
  


  const getInitialSections = () => {
    return ["main", ...Array.from({ length: imageSectionCount }, (_, i) => `image${i + 1}`)];
  };

  const initialSections = getInitialSections();

  useEffect(() => {
    dispatch({ type: "Small" });

    return () => {
      dispatch({ type: "Default" });
    };
  }, [dispatch]);

const handleFileChange = (sectionIndex, imageIndex, file, isFeaturedImage) => {
  const updatedImageFiles = [...imageFiles];

  if (isFeaturedImage && sectionIndex < detailSections.length) {
    // Update featured image for the corresponding detail section
    updatedImageFiles[sectionIndex].featuredImage = file;
  } else if (sectionIndex >= 0 && sectionIndex < imageSectionCount) {
    // Update image file for the corresponding image section
    updatedImageFiles[sectionIndex][imageIndex] = file;
  }

  setImageFiles(updatedImageFiles);
};

  
  
  

  

  return (
    <div className="new">
      <div className="all-projects-page-wrap">
        <div className="add-projects-content">
          <div className={`add-projects-list`}>
            <h1>New Project</h1>
            <form onSubmit={handleAdd}>
              <div>
                <div className="section-title">Main Section</div>
                {projectMainSection.map((input) => (
                  <div className="formInput" key={input.id}>
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
                <div className="formInput">
                  <label>Upload Featured Image (Main Section)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMainFeaturedImage(e.target.files[0])}
                  />
                </div>
                {mainFeaturedImage && (
                  <img
                    src={URL.createObjectURL(mainFeaturedImage)}
                    alt="main-featured-image"
                    className="uploaded-image-preview"
                  />
                )}
              </div>
              <div className="uploaded-section-wrap">
              {detailSections.map((detailSection, index) => (
  <div key={detailSection.id}>
    <div className="section-title">{`Detail Section ${index + 1}`}</div>

    {/* Add image upload button and preview for featured image */}
    <div className="formInput">
      <label>Upload Featured Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(index, 0, e.target.files[0], true)}
      />
    </div>
    {imageFiles[index].featuredImage && (
      <img
        src={URL.createObjectURL(imageFiles[index].featuredImage)}
        alt="featured-image"
        className="uploaded-image-preview"
      />
    )}

    {/* Rest of the detail section inputs */}
    {projectDetailSection.map((input) => (
      <div className="formInput" key={input.id}>
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

    <button
      type="button"
      onClick={() => handleRemoveField(detailSection.id)}
    >
      Remove Detail Section {index + 1}
    </button>
  </div>
))}

              </div>

              <div className="uploaded-section-wrap uploaded-image-section-wrap">

              {initialSections.map((initialSection, sectionIndex) => (
                <div className="body image-section-title">
                  <span>    
                    Image Section {sectionIndex + 1}
                  </span>
                
  <div key={sectionIndex} className={`image-section-${sectionIndex}`}>

    {[...Array(24)].map((_, index) => (
      
      <div
        key={index}
        className={`image-section${index === dragOverSection ? ' drag-over' : ''} list-map-wrap`}
        onDragEnter={() => handleDragEnter(sectionIndex)}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, sectionIndex, index)}
      >
        <div>
        <input
          type="file"
          id={`file-${sectionIndex}-${index}`}
          onChange={(e) => handleFileChange(sectionIndex, index, e.target.files[0])}
          style={{ display: 'none' }}
          accept="image/*"
        />
        <label htmlFor={`file-${sectionIndex}-${index}`} className=" file-label primary-button" >
          <span >
             image {index + 1}
          </span>
 
         
        </label>
        
        </div>
        
        <img
          src={
            imageFiles[sectionIndex] && imageFiles[sectionIndex][index]
              ? URL.createObjectURL(imageFiles[sectionIndex][index])
              : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
          }
          alt="uploaded-image"
          className="map-image-upload-thumb"
        />
      </div>
      
    ))}
    
    {initialSection.startsWith("image") && initialSection !== "main" && (
      <button type="button" onClick={() => handleRemoveField(initialSection)}>
        Remove Image Section {sectionIndex + 1}
      </button>
    )}
    
  </div>
  </div>
))}



              </div>
              <div className="add-button-grid">
              <button
                type="button"
                onClick={() => handleAddField("detail")}
                disabled={sections.includes("detail") || detailSections.length >= 3}
              >
                <img src='/icons/fiftyfifty.svg' alt="detail section"/>
                Add Detail Section
              </button>

              <button
                type="button"
                onClick={() => handleAddField("image")}
                disabled={sections.includes("image") || imageSectionCount >= 3}
              >
                <img src='/icons/Masonry.svg' alt="image section"/>
                Add Image Section
              </button>

              <button
                type="button"
                onClick={() => handleAddField("image")}
                disabled={sections.includes("image") || imageSectionCount >= 3}
              >
                <img src='/icons/Text.svg' alt="image section"/>
                Add Text Section
              </button>

              <button
                type="button"
                onClick={() => handleAddField("image")}
                disabled={sections.includes("image") || imageSectionCount >= 3}
              >
                <img src='/icons/LargeImage.svg' alt="image section"/>
                Add Highlight Section
              </button>

              <button
                type="button"
                onClick={() => handleAddField("image")}
                disabled={sections.includes("image") || imageSectionCount >= 3}
              >
                <img src='/icons/title.svg' alt="image section"/>
                Add Title Section
              </button>
              </div>

              <button disabled={perc != null && perc < 100} type="submit">
                Send
              </button>
              {perc}
            </form>
          </div>
        </div>
      </div>
    </div>
    
  );

};

export default AddProject;