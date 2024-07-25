import React, { createContext, useContext, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(true);



  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, isComplete, setIsComplete }}>
      {children}
    </LoadingContext.Provider>
  );
};
