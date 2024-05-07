import React, { createRef, useEffect, useRef } from 'react';
import styles from './referencePeace.module.css';
import './referencePeace.css'
import MouseCursor from "../../../utils/mouseCursor";


function ReferencePeace() {
    let currentIndex = 0;
    let collection = [];
    const ref = useRef(null);
    let step = 0;
    let maxImages = 2;
    let nbOfImages = 0;

    const manageMouseMove = (e) => {
        const { clientX, clientY, movementX, movementY } = e;

        step += Math.abs(movementY) + Math.abs(movementX)*1.5;

        if(step >= 95 * currentIndex){
            MouseMove(clientX, clientY);
            if(nbOfImages == maxImages){
                removeImage();
            }
        }


        if(currentIndex == collection.length){
            currentIndex = 0;
            step = -95;
        }
    };

    const removeImage = () => {
        const images = getImages();
        nbOfImages--;

        images[0].style.transition = '500ms ease scale 0.2s, 500ms ease opacity 0.2s';
        images[0].style.opacity = '0';
        images[0].style.scale = '0.2';

    }

    const MouseMove = (x, y) => {
        const targetImage = collection[currentIndex].current;
    

        const maxX = window.innerWidth - 360;
        const newX = Math.min(x, maxX);
    
        targetImage.style.left = newX + 'px';
        targetImage.style.top = y + 'px';
        
        targetImage.style.zIndex = '1';
        targetImage.style.transition = '0ms opacity, 0ms scale';
        targetImage.style.opacity = '1';
        targetImage.style.scale = '1';
    
   
    
        currentIndex++;
        nbOfImages++;

        resetZIndex();
    };
    


    const resetZIndex = () => {
        const images = getImages();
        for(let i = 0 ; i < images.length ; i++){
          images[i].style.zIndex = i;
        }
    }
    
    

    const getImages = () =>{
        let images=[];
        const indexOfFirstImage = currentIndex - nbOfImages;
        for(let i = indexOfFirstImage; i < currentIndex; i++){
            let targetIndex = i;
            if(targetIndex < 0) targetIndex += collection.length;
            images.push(collection[targetIndex].current);
        }
        return images;
    }

    return (
        <section className={`reference-peace-page ${styles['reference-peace-page']}`} onMouseMove={(e) => manageMouseMove(e)}>
     
            <div className={`reference-peace-title-wrap ${styles['reference-peace-title-wrap']}`}>
                <span className={`reference-peace-title-reference ${styles['reference-peace-title-reference']}`}>
                    Reference
                </span>
                <span className={`reference-peace-title-peace ${styles['reference-peace-title-peace']}`}>
                    Peace
                </span>
            </div>
            <MouseCursor/>
            <div className='images-wrap'>
                {[...Array(31).keys()].map((index) => {
                    // Create a new ref for each image element
                    const imageRef = createRef(null);
                    collection.push(imageRef);
                    console.log(collection)

                    return (
                        <img
                            ref={imageRef}
                            className={`image-trail-${index} ${styles['trail-image']}`}
                            key={index}
                            src={`/imagery/referencePeace/${index}.webp`}
                        ></img>
                    );
                })}  
            </div>
        </section>
    );
}

export default ReferencePeace;
