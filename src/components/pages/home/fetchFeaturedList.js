import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from '../../../firebase/firebase';

const useRealtimeFeaturedProjects = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "projects"), where("isFeatured", "==", true), orderBy("featuredIndex"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const featuredList = [];
      snapshot.forEach((doc) => {
        featuredList.push({ id: doc.id, ...doc.data() });
      });
      setFeaturedProjects(featuredList);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once

  return featuredProjects;
};

export default useRealtimeFeaturedProjects;
