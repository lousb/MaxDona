import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './style.css';

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = ({ url, className }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    const updateParallax = () => {
      const scrollHeight = image.offsetHeight - container.offsetHeight;

      gsap.to(image, {
        y: () => scrollHeight,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: `bottom top+=${scrollHeight}`,
          scrub: true,
          pin: false,
          markers: true,
          invalidateOnRefresh: true,
        },
      });
    };

    updateParallax();
    window.addEventListener('resize', updateParallax);

    return () => {
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  return (
    <div
      className={`parallax-image-container ${className}-wrap ${className}-wrap-parallax-div-index-on-page`}
      ref={containerRef}
    >
      <img src={url} className={className} ref={imageRef} />
    </div>
  );
};

export default ParallaxImage;
