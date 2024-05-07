import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../../firebase/firebase";
import { projectInputs } from "../../formSource";
import { getStorage , ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const UpdatePortfolio = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [projectData, setProjectData] = useState({});
  const [imageSectionData, setImageSectionData] = useState([]);
  const [detailSectionData, setDetailSectionData] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const storage = getStorage();

  const fetchProjectData = async () => {
    try {
      const projectDoc = doc(db, "projects", projectId);
      const projectSnapshot = await getDoc(projectDoc);
      if (projectSnapshot.exists()) {
        const data = projectSnapshot.data();
        setProjectData(data);

        // Extract image and detail section data
        setImageSectionData(data.imageUrls || []);
        setDetailSectionData(data.details || {});
      } else {
        // Handle project not found.
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Check if the input belongs to image section or detail section
    if (id.startsWith('image-')) {
      // Update image section data
      const sectionIndex = parseInt(id.split('-')[1]);
      const imageUrlIndex = parseInt(id.split('-')[2]);
      setImageSectionData((prevData) => {
        const updatedData = { ...prevData };
        updatedData[`image${sectionIndex}`][imageUrlIndex] = value;
        return updatedData;
      });
    } else if (id.startsWith('detail-')) {
      // Update detail section data
      const [_, detailKey, detailFieldKey] = id.split('-');
      setDetailSectionData((prevData) => {
        const updatedData = { ...prevData };
        updatedData[detailKey][detailFieldKey] = value;
        return updatedData;
      });
    } else {
      // Update main section data
      setProjectData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleEditImage = (sectionIndex, imageIndex, e) => {
    e.preventDefault();
    setEditingImage({ sectionIndex, imageIndex });
  };


  
  const editImage = async (imageData, sectionIndex, imageIndex) => {
    // Simulated function to edit image and return the edited image URL
    console.log('Editing image:', sectionIndex, imageIndex);
    // For simplicity, we'll just return the original image URL
    return imageData[`image${sectionIndex}`][imageIndex];
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Upload files and update image URLs
      const updatedImageUrls = await uploadImageFiles();
  
      const updatedProjectData = {
        ...projectData,
        // Update image URLs with the uploaded file URLs
        imageUrls: updatedImageUrls,
        // Include your logic for processing other form data here
        timeStamp: serverTimestamp()
      };
  
      await updateDoc(doc(db, "projects", projectId), updatedProjectData);
      navigate(-1);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };
  
  const uploadImageFiles = async () => {
    const updatedImageUrls = [];
  
    for (let sectionIndex = 0; sectionIndex < imageSectionData.length; sectionIndex++) {
      const sectionImageUrls = [];
  
      for (let imageIndex = 0; imageIndex < imageSectionData[sectionIndex].length; imageIndex++) {
        const imageUrl = imageSectionData[sectionIndex][imageIndex];
  
        if (imageUrl instanceof File) {
          // Upload the file to Firebase Storage
          const storageRef = ref(storage, `imageSection${sectionIndex}/${imageUrl.name}`);
          const uploadTask = uploadBytesResumable(storageRef, imageUrl);
  
          try {
            await uploadTask;
            const downloadURL = await getDownloadURL(storageRef);
            sectionImageUrls.push(downloadURL);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
          }
        } else {
          sectionImageUrls.push(imageUrl);
        }
      }
  
      updatedImageUrls.push(sectionImageUrls);
    }
  
    return updatedImageUrls;
  };
  

  return (
    <div className="update-portfolio">
      <form onSubmit={handleUpdate}>
        {/* Main Section */}
        <div className="section-title">Main Section</div>
        {projectInputs.map((input) => (
          <div className="formInput" key={input.id}>
            <label>{input.label}</label>
            <input
              type={input.type || "text"}
              id={input.id}
              value={projectData[input.id] || ''}
              placeholder={input.label}
              onChange={handleInputChange}
              required
            />
          </div>
        ))}

        {/* Image Sections */}
        {Object.keys(imageSectionData).map((key, index) => (
          <div key={`image-section-${index}`} className="section-title">
            Image Section {index + 1}
            {imageSectionData[key].map((imageUrl, i) => (
              <div key={`image-${index}-${i}`}>
                <img src={imageUrl} alt={`Image ${i + 1}`} />
                {editingImage && editingImage.sectionIndex === index && editingImage.imageIndex === i && (
                  <div>
                    {/* Placeholder for image editing controls */}
                  </div>
                )}
                <button onClick={(e) => handleEditImage(index, i, e)}>Edit Image</button>

              </div>
            ))}
          </div>
        ))}

        {/* Detail Sections */}
        {Object.entries(detailSectionData).map(([detailKey, detailValue]) => (
          <div key={`detail-section-${detailKey}`} className="section-title">
            Detail Section {detailKey.replace("detail", "")}
            {Object.entries(detailValue).map(([detailFieldKey, detailFieldValue]) => (
              <div className="formInput" key={detailFieldKey}>
                <label>{detailFieldKey}</label>
                <input
                  type="text"
                  id={`detail-${detailKey}-${detailFieldKey}`}
                  value={detailFieldValue}
                  placeholder={detailFieldKey}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}
          </div>
        ))}

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdatePortfolio;
