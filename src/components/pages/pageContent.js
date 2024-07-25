// App.js
import React, {useEffect, useRef} from "react";
import Home from './home/home'
import Top from "../../utils/headerActive";
import Gallery from "./gallery/gallery";
import Films from "./films/films";
import { ScrollTrigger } from "gsap/all";
import AllProjects from './admin-pages/allProjects'
import Contact from './contact/contact'
import { HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import FooterSmall  from '../molecules/footer/small/footer'
import DefaultFooter  from '../molecules/footer/large/footer'
import {FooterContextProvider, useFooter} from '../../context/FooterContext';

import AddProject from "./admin-pages/portfolio/addPortfolio/addPortfolio";
import UpdateProject from "./admin-pages/portfolio/updatePortfolio/updatePortfolio";
import Login from "./admin-pages/login/Login";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Single from "./single/single";
import SingleImageView from "./image/image";
import ReferencePeace from "./referencePeace/referencePeace";
import ReferenceSingle from "./referencePeace/referenceSingle/referenceSingle";
import About from "./about/about";

import { gsap } from "gsap";
import Lenis from "@studio-freight/lenis";
import { LoadBundleTask } from "firebase/firestore";
import Loading from "../molecules/LoadingScreen/loading";
import AddReference from "./admin-pages/references/addReference/addReference";




function PageContent() {



  let containerRef = useRef(null)
  const {currentUser} = useContext(AuthContext)


  const RequireAuth = ({children})=>{
    return currentUser ? children : <Navigate to='/login'/>;
  };


  useEffect(()=>{
    const lenis = new Lenis({
      duration:0.8,
      orientation:'vertical',
      gestureOrientation:'vertical',
      smoothWheel:true,
      lerp:0.5,
      })

      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time)=>{
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Function to handle mouse down and up events
    const handleMouseDown = () => {
      document.querySelector('.page-content').classList.add('press-down');
    };

    const handleMouseUp = () => {
      document.querySelector('.page-content').classList.remove('press-down');
    };

    // Add event listeners
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  })
  
  return (
    <div className="page-content" id="smooth-scroll">

      
      <FooterContextProvider 
      >
      <Router>
      <Loading />
      <div className="routes">

   
        <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reference-peace" element={<ReferencePeace />}>
          </Route>
          <Route
                path="reference-peace/:projectId"
                element={

                    <ReferenceSingle />
                }

          >

          </Route>
          <Route path="/projects">
          <Route index element={<RequireAuth><AllProjects /></RequireAuth>} />
          <Route
              path="referencepeace/new"
              element={<RequireAuth><AddReference title="Reference Peace" /></RequireAuth>}
          />
            <Route
                path="new"
                element={<RequireAuth><AddProject title="Add New Project" /></RequireAuth>}
            />
            <Route
                path="update/:projectId"
                element={<RequireAuth><UpdateProject/></RequireAuth>}
            />
            <Route path="/projects/:projectId/:imageIndex" element={<SingleImageView />} />


          </Route>
          <Route
                path="projects/:projectId"
                element={
  
                    <Single />
                }
        
          >
        

          </Route>
          <Route path="/login" element={<Login/>}></Route>

 
        </Routes>
        </div>
        <FooterSelector />
   
   
      </Router>
      </FooterContextProvider>


      <Top/>
      <div className="transition-overlay">
      </div>
    </div>);
}

function FooterSelector() {
  const { state } = useFooter(); // Access the context value

  // Conditionally render the appropriate footer component
  return state.default ? <DefaultFooter /> : <FooterSmall />;
}


export default PageContent;
