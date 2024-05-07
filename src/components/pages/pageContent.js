// App.js
import React, {useEffect, useRef} from "react";
import Home from './home/home'
import Top from "../../utils/headerActive";
import Gallery from "./gallery/gallery";
import Films from "./films/films";
import { ScrollTrigger } from "gsap/all";
import AllProjects from './admin-pages/allProjects'
import Contact from './contact/contact'
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import FooterSmall  from '../molecules/footer/small/footer'
import DefaultFooter  from '../molecules/footer/large/footer'
import {FooterContextProvider, useFooter} from '../../context/FooterContext';
import { projectInputs } from "./admin-pages/formSource";
import AddProject from "./admin-pages/portfolio/addPortfolio/addPortfolio";
import UpdateProject from "./admin-pages/portfolio/updatePortfolio/updatePortfolio";
import Login from "./admin-pages/login/Login";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Single from "./single/single";
import useMouseLeave from "../../utils/mouseOutCursor";
import SingleImageView from "./image/image";
import ReferencePeace from "./referencePeace/referencePeace";
import About from "./about/about";

import { gsap } from "gsap";
import Lenis from "@studio-freight/lenis";




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
  })
  
  return (
    <div className="page-content" id="smooth-scroll">

      
      <FooterContextProvider 
      >
      <Router>
        
        <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reference-peace" element={<ReferencePeace />} />
          <Route path="/projects">
          <Route index element={<RequireAuth><AllProjects /></RequireAuth>} />
            <Route
                path="new"
                element={<RequireAuth><AddProject inputs={projectInputs} title="Add New Project" /></RequireAuth>}
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
        <FooterSelector />
      </Router>
      </FooterContextProvider>


      <Top/>
    </div>);
}

function FooterSelector() {
  const { state } = useFooter(); // Access the context value

  // Conditionally render the appropriate footer component
  return state.default ? <DefaultFooter /> : <FooterSmall />;
}


export default PageContent;
