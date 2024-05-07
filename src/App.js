// App.js
import React from "react";
import './App.css';

//components
import Header from './components/molecules/header/dropdown/header';
import PageContent from './components/pages/pageContent.js';
import Footer from './components/molecules/footer/large/footer.js';



//context - Make sure to use the correct import name here
import './fonts/TuskerGrotesk-6700Bold.ttf'
import MouseCursor from "./utils/mouseCursor";



function App() {
  
 

  return (

      <div className="App">
        {/* <div className='grid-overlay'></div> */}
        <Header/>
     
          <PageContent/> 
   


        
      </div>
 

  );
}

export default App;
