// App.js
import React from "react";
import './App.css';

//components
import Header from './components/molecules/header/dropdown/header';
import PageContent from './components/pages/pageContent.js';
import Footer from './components/molecules/footer/large/footer.js';



//context - Make sure to use the correct import name here
import MouseCursor from "./utils/mouseCursor";
import { HeaderProvider } from "./utils/headerContext.js";
import { LoadingProvider } from "./utils/LoadingContext.js";
import ErrorBoundary from "./utils/ErrorBoundary.js";



function App() {
  
 

  return (

      <div className="App">
        <ErrorBoundary>
        {/* <div className='grid-overlay'></div> */}
          <Header/>
          <LoadingProvider>
            <PageContent/> 
          </LoadingProvider>
          <MouseCursor/>
          </ErrorBoundary>


        
      </div>
 

  );
}

export default App;
