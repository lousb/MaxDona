// imageUpload.js

import React, { useState } from 'react';
import { storage } from '../../../firebase/firebase';

const ImageUpload = ({ imageSectionCount, handleImageUpload }) => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);

      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleUpload = () => {
    if (image) {
      const imageName = `imageSection${imageSectionCount + 1}/${image.name}`;
      const storageRef = storage.ref(`images/${imageName}`);
      storageRef.put(image).then(() => {
        storageRef.getDownloadURL().then((url) => {
          setImageUrl(url);
          handleImageUpload(url);  // Notify parent component of the uploaded image URL
        });
      });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
i
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default ImageUpload;
