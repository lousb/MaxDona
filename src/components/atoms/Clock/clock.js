 import React, { useEffect, useState } from "react";
 import './clock.css'
 
 
 // Function to display current Sydney time
 export const Clock = (isActive) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const interval = setInterval(() => {
        setTime(new Date());
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    // Convert the time to Sydney timezone
    const sydneyTime = new Date(time.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }));
    const hour = sydneyTime.getHours().toString().padStart(2, '0');
    const minute = sydneyTime.getMinutes().toString().padStart(2, '0');

    if(isActive) {
      return (
        <p className={`menu-time body`}>
           Sydney<br/>
          <span className={"menu-time-func"}>
           
           ({hour}<span className='colon'>:</span>{minute})
          </span>
        </p>
  
      );
    }



    
  };

export default Clock;