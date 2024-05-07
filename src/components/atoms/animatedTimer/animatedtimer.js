import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './animatedtimer.css';

const TickingClock = ({ externalValue, mode }) => {
  const valueRef = useRef(externalValue);

  useEffect(() => {
    const interval = setInterval(() => {
      let formattedValue;
      if (mode === 'clock') {
        formattedValue = valueRef.current.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).replace(/:/g, '');
      } else if (mode === 'counter') {
        formattedValue = valueRef.current.toString();
      }

      gsap.to('.digit', {
        duration: 0.5,
        y: '-=10%', // Adjust the percentage to fit your desired movement
        ease: 'power2.inOut',
        onComplete: () => {
          updateDigits(formattedValue);
        },
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const updateDigits = (value) => {
    const digits = value.split('');

    gsap.set('.digit', { y: '100%' }); // Reset digits to the bottom

    digits.forEach((digit, index) => {
      gsap.to(`#digit-${index}`, {
        duration: 0.5,
        y: '0%',
        delay: 0.1 * index, // Adjust the delay for staggered movement
        ease: 'power2.inOut',
        onComplete: () => {
          document.getElementById(`digit-${index}`).innerText = digit;
        },
      });
    });
  };

  const renderDigits = () => {
    const digits = Array.from({ length: 10 }, (_, index) => (
      <div key={`digit-${index}`} id={`digit-${index}`} className="digit">
        {index}
      </div>
    ));

    return <div className="digit-container">{digits}</div>;
  };

  return (
    <div className="clock">
      {renderDigits()}
    </div>
  );
};

export default TickingClock;
