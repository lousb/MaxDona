import './addReference.css'
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp, doc, setDoc, getDocs } from "firebase/firestore";
import { db, storage } from "../../../../../firebase/firebase";
import { useFooter } from "../../../../../context/FooterContext";
import { referenceMainSection, videoSectionSource, pdfSectionSource, titleSectionSource } from '../../formSource';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { encode } from 'blurhash';
import Masonry from "./SVG/MasonrySVG";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Video from './SVG/videoSVG';
import PDFselector from './SVG/PDFselectorSVG';


const AddReference = ({ inputs, title }) => {
  const [perc, setPerc] = useState(null);
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [sections, setSections] = useState(["main"]);
  const [imageSectionCount, setImageSectionCount] = useState(0);
  const [pdfSectionCount, setPdfSectionCount] = useState(0);
  const [videoSectionCount, setVideoSectionCount] = useState(0);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [pdfTypeSelection, setPdfTypeSelection] = useState(null);


const handlePdfTypeSelection = (type) => {
  setPdfTypeSelection(type);
};
  

  
  const [file, setFile] = useState("");
  const { dispatch } = useFooter();

const [imageFiles, setImageFiles] = useState(Array.from({ length: 25 }, () => []));
  const [detailSections, setDetailSections] = useState([]);
  const [pdfSections, setPdfSections] = useState([]);
  const [videoSections, setVideoSections] = useState([]);
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


        let newSection = "";
        let sectionType = '';
        let newIndex = 0;


        if (section === "image" && imageSectionCount < 1 && sections.length <=2) {
        sectionType = 'image';
        setImageSectionCount((prevCount) => prevCount + 1);
        newSection = `${sectionType + 1}`;
        newIndex = imageSectionCount + 1;

        } else if (section === "PDF" && pdfSections.length < 1 && sections.length <=2) {
        sectionType = 'PDF';
        const newPdfSection = { id: `PDF${pdfSections.length + 1}` };
        setPdfSections((prev) => [...prev, newPdfSection]);
        newSection = newPdfSection.id;
        newIndex = pdfSections.length + 1;
        setPdfFiles((prev) => [...prev, null]); // Ensure a corresponding slot in pdfFiles

        } else if (section === "video" && videoSections.length < 1 && sections.length <=2) {
        sectionType = 'video';
        const newVideoSection = { id: `video${videoSections.length + 1}` };
        setVideoSections((prev) => [...prev, newVideoSection]);
        newSection = newVideoSection.id;
        newIndex = videoSections.length + 1;
        }

        if (newSection) {
          setSections((prev) => [...prev, newSection]);
          setImageFiles((prev) => [...prev, []]); // Add empty image files array for the new section
          console.log(sections);

         }

     
       
};
  

useState(()=>{
    console.log(sections);
}, [sections])
  

  
  
const handleRemoveField = (section) => {
  if (section !== "main") {
    const sectionType = section.startsWith("image") ? "image" :
                        section.startsWith("detail") ? "detail" :
                        section.startsWith("PDF") ? "PDF" :
                        section.startsWith("video") ? "video" :
                        "title";
    
    const sectionIndex = parseInt(section.replace(`${sectionType}`, ""), 10) - 1;

    const updatedSections = sections.filter((s) => s !== section);
    setSections(updatedSections);

    if (sectionType === "image") {
      const updatedImageFiles = [...imageFiles];
      updatedImageFiles.splice(sectionIndex, 1);
      setImageFiles(updatedImageFiles);
      setImageSectionCount((prevCount) => prevCount - 1);
    } else if (sectionType === "PDF") {
      setPdfSections((prev) => prev.filter((pdf) => pdf.id !== section));
      setPdfFiles((prev) => {
        const updatedPdfFiles = [...prev];
        updatedPdfFiles.splice(sectionIndex, 1); // Adjust index for array-based operations
        return updatedPdfFiles;
      });
      setPdfSectionCount((prevCount) => prevCount - 1);
      // Reset PDF type selection when removing a PDF section
      setPdfTypeSelection(null);
    } else if (sectionType === "video") {
      setVideoSections((prev) => prev.filter((video) => video.id !== section));
      setVideoSectionCount((prevCount) => prevCount - 1);
    }
  }
};




  

const getDisplayName = async () => {
  try {
    const referenceCollection = collection(db, "referencePeace");
    const referenceSnapshot = await getDocs(referenceCollection);
    const docCount = referenceSnapshot.size + 1; // Adding 1 for the new document
    const formattedIndex = String(docCount).padStart(2, '0');
    const displayName = `VOLUME${formattedIndex}`;
    
    console.log('Generated Display Name:', displayName); // Add this line
    return displayName;
  } catch (error) {
    console.error('Error getting display name:', error);
    return null;
  }
};


useEffect(() => {
  const fetchDisplayName = async () => {
    const newDisplayName = await getDisplayName();
    if (newDisplayName) {
      setDisplayName(newDisplayName);
    }
  };

  fetchDisplayName();
}, []);
  
  
const handleAdd = async (e) => {
  e.preventDefault();

  try {
    const displayName = await getDisplayName();
    console.log('Display Name:', displayName);
    if (!displayName) {
      throw new Error('Display name could not be generated.');
    }

   // Determine the volumeType based on the sections
   let volumeType = 'Unknown';

   if (videoSections.length > 0) {
     volumeType = 'Video';
   } else if (pdfSections.length > 0) {
     volumeType = `PDF`; // PDF1 or PDF2
   } else if (imageSectionCount > 0) {
     volumeType = 'Image';
   }

    const projectData = {
      displayName: displayName,
      releaseDate: data.releaseDate,
      mainDescription1: data.mainDescription1,
      mainDescription2: data.mainDescription2,
      mainFeaturedImage: null,
      timeStamp: serverTimestamp(),
      volumeType: volumeType || 'Unknown', // Add the volumeType field
      imageSections: [],
      videoSections: [],
      pdfSections: [],
    };

    // Handle video sections
    for (let i = 0; i < videoSections.length; i++) {
      const sectionId = videoSections[i].id;
      console.log('VIDEO section ID ' + sectionId);
      projectData.videoSections.push({
        sectionId: sectionId,
        videoUrl: data[`${sectionId}-videoLink`] || '',
        videoName: data[`${sectionId}-videoName`] || '',
      });
    }

    // Handle PDF sections
    for (let i = 0; i < pdfSections.length; i++) {
      const sectionId = pdfSections[i].id;
      console.log('PDF section ID ' + sectionId);
      projectData.pdfSections.push({
        sectionId: sectionId,
        pdfLink: data[`pdfLink${i}`] || '',
        pdfName: data[`pdf${i + 1}-pdfName`] || '',
      });
    }

    // Handle main featured image
    if (mainFeaturedImage) {
      const name = new Date().getTime() + mainFeaturedImage.name;
      const storageRef = ref(storage, `mainFeaturedImages/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, mainFeaturedImage);
      await uploadTask;
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      projectData.mainFeaturedImage = downloadURL;
    }

    // Handle image sections
    for (let sectionIndex = 1; sectionIndex <= imageSectionCount; sectionIndex++) {
      const sectionImageUrls = [];

      for (let fileIndex = 0; fileIndex < imageFiles[sectionIndex].length; fileIndex++) {
        const file = imageFiles[sectionIndex][fileIndex];
        
        if (file) {
          const name = new Date().getTime() + file.name;

          // Upload the original image
          const storageRef = ref(storage, `image${sectionIndex}/${name}`);
          await uploadBytesResumable(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);

          // Resize the image and generate BlurHash
          const resizedImage = await resizeImage(file, 50);
          const blurhash = await generateBlurHash(resizedImage);

          // Upload the blurhashed image
          const blurhashName = new Date().getTime() + '-blurhash.jpeg';
          const blurhashStorageRef = ref(storage, `image${sectionIndex}/${blurhashName}`);
          await uploadBytesResumable(blurhashStorageRef, resizedImage);
          const blurhashDownloadURL = await getDownloadURL(blurhashStorageRef);

          sectionImageUrls.push({ url: downloadURL, blurhash: blurhashDownloadURL });
        }
      }

      // Add image URLs to projectData if there are any
      if (sectionImageUrls.length > 0) {
        projectData.imageSections.push({
          sectionIndex: sectionIndex,
          images: sectionImageUrls,
        });
      }
    }

    // Save project data to Firestore
    const projectDocRef = doc(db, "referencePeace", displayName);
    await setDoc(projectDocRef, projectData);

    navigate(-1);
  } catch (err) {
    console.error('Error adding project:', err);
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
  
const handlePdfFileChange = (e, sectionIndex) => {
  const file = e.target.files[0];
  const updatedPdfFiles = [...pdfFiles];
  updatedPdfFiles[sectionIndex] = file;
  setPdfFiles(updatedPdfFiles);
};
  


useEffect(() => {
  const uploadPdfFile = async (file, sectionIndex) => {
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, `pdfs/${name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPerc(progress);
      },
      (error) => console.log('Error during upload:', error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setData((prev) => ({ ...prev, [`pdfLink${sectionIndex}`]: downloadURL }));
      }
    );
  };

  pdfFiles.forEach((file, index) => {
    if (file) uploadPdfFile(file, index);
  });
}, [pdfFiles]);

  
  
  
  // Function to create a valid class name from the label
  const getClassNameFromLabel = (label) => {
    return label.replace(/\s+/g, '').toLowerCase();
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
  updatedImageFiles[sectionIndex].videos = [file];
}

// Update the imageFiles state
setImageFiles(updatedImageFiles);
};
  

  

  
  


return (
  <div className="new">
    <div className="all-projects-page-wrap">
      <div className="add-projects-content">
        <div className={`add-projects-list`}>
          <form onSubmit={handleAdd}>

            <div>
              <div className={`section-title`}>Reference Peace</div>
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
                  placeholder={displayName}
                  onChange={handleInput}
                  required
                  readOnly
                />
              </div>
              <div className="formInput projectImage">
                <label>Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMainFeaturedImage(e.target.files[0])}
                />
              </div>
              {referenceMainSection.map((input) => (
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

            {videoSections.map((videoSections, index) => (
              <div key={`video-${index + 1}`}>
                <div className="section-wrap">
                  <div className="section-title">{`Video Section ${index + 1}`}</div>
                  {videoSectionSource.map((input) => (
                    <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
                      <label>{input.label}</label>
                      <input
                        id={`video${index + 1}-${input.id}`}
                        type={input.type}
                        placeholder={input.placeholder}
                        onChange={handleInput}
                        maxLength={input.maxLength || null}
                        required
                      />
                    </div>
                  ))}
                  <button type="button" onClick={() => handleRemoveField(videoSections.id)}>
                    Remove PDF Section {index + 1}
                  </button>
                </div>
              </div>
            ))}

            {Array.from({ length: imageSectionCount }).map((_, index) => (
              <div className='uploaded-image-section-wrap' key={`image-section-${index + 1}`}>
                <div className="body image-section-title">
                  <span>Image Section {index + 1}</span>
                  <div className={`image-section-${index + 1}`}>
                    {[...Array(24)].map((_, imageIndex) => (
                      <div
                        key={imageIndex}
                        className={`image-section ${imageIndex === dragOverSection ? 'drag-over' : ''} list-map-wrap`}
                        onDragEnter={() => handleDragEnter(index + 1)}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index + 1, imageIndex)}
                      >
                        <div>
                          <input
                            type="file"
                            id={`file-${index + 1}-${imageIndex}`}
                            onChange={(e) => handleFileChange(index + 1, imageIndex, e.target.files[0])}
                            style={{ display: 'none' }}
                            accept="image/*"
                          />
                          <label htmlFor={`file-${index + 1}-${imageIndex}`} className="file-label primary-button">
                            <span>image {imageIndex + 1}</span>
                          </label>
                        </div>

                        <img
                          src={
                            imageFiles[index + 1] && imageFiles[index + 1][imageIndex]
                              ? URL.createObjectURL(imageFiles[index + 1][imageIndex])
                              : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'
                          }
                          alt="uploaded-image"
                          className="map-image-upload-thumb"
                        />
                      </div>
                    ))}
                    <button type="button" onClick={() => handleRemoveField(`image${index + 1}`)}>
                      Remove Image Section {index + 1}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pdfSections.map((pdfSection, index) => (
              <div key={`pdf-${index + 1}`}>
                {!pdfTypeSelection && (
                  <div>
                    <label>Select PDF Type:</label>
                    <button type="button" onClick={() => handlePdfTypeSelection('1')}>
                      1 Page PDF
                    </button>
                    <button type="button" onClick={() => handlePdfTypeSelection('2')}>
                      2 Page PDF
                    </button>
                  </div>
                )}

                {pdfTypeSelection && (
                  <div className="section-wrap">
                    <div className="section-title">{`${pdfTypeSelection === '1' ? '1 Page PDF' : '2 Page PDF'} Selected`}</div>
                    {pdfSections.map((pdfSection, index) => (
                      <div key={`pdf-${index + 1}`}>
                        <div className="section-wrap">
                          <div className="section-title">{`PDF Section ${index + 1}`}</div>
                          {pdfSectionSource.map((input) => (
                            <div>
                              <div className={`formInput ${getClassNameFromLabel(input.label)}`} key={input.id}>
                                <label>{input.label}</label>
                                <input
                                  id={`pdf${index + 1}-${input.id}`}
                                  type={input.type}
                                  placeholder={input.placeholder}
                                  onChange={handleInput}
                                  maxLength={input.maxLength || null}
                                  required
                                />
                              </div>
                              <input type="file" accept="application/pdf" onChange={(e) => handlePdfFileChange(e, index)} />
                            </div>
                          ))}
                          <button type="button" onClick={() => handleRemoveField(pdfSection.id)}>
                            Remove PDF Section {index + 1}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
            {sections.length <= 1 && 
            <div className="add-button-grid">
              <button
                type="button"
                onClick={() => handleAddField('video')}
                disabled={videoSections.length >= 10}
              >
                <Video />
                Video Project
              </button>

              <button
                type="button"
                onClick={() => handleAddField('image')}
                disabled={imageSectionCount >= 10}
              >
                <Masonry />
                Gallery Project
              </button>

              <button
                type="button"
                onClick={() => handleAddField('PDF')}
                disabled={pdfSections.length >= 10}
              >
                <PDFselector />
                PDF Booklet Project
              </button>
            </div>
            
            }
            

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



export default AddReference;