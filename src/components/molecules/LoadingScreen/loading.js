import React, { useEffect } from "react";
import './loading.css';
import gsap from "gsap";
import MouseCursor from "../../../utils/mouseCursor";
import { useLoading } from "../../../utils/LoadingContext";

function Loading() {
    const { isLoading, setIsLoading, isComplete, setIsComplete } = useLoading();



    const runAnimation = () => {
        const timeoutId = setTimeout(() => {
            setIsComplete(false);
            document.body.classList.add('loading-complete');

            gsap.fromTo('.loading-wrap', {clipPath:'inset(0 0 0 0 round 20px)', duration:1}, {
                clipPath: 'inset(0 0 100% 0 round 20px)',
                duration: 1,
                onComplete: () => {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 500);
                }
            });
        }, 1000);

        // Cleanup the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
    };

    useEffect(() => {
        // Wait for fonts to load before running the animation
        document.fonts.ready.then(() => {
            // Run animation on component mount (initial load)
            runAnimation();
        });

        const handleRouteChange = () => {
            runAnimation();
            setIsLoading(true);
            setIsComplete(true);
            document.body.classList.remove('loading-complete'); // Reset class on route change
        };

        // Listen for custom routeChange event
        window.addEventListener('routeChange', handleRouteChange);

        return () => {
            window.removeEventListener('routeChange', handleRouteChange);
        };
    }, []);

    return (
        <div className={`loading-wrap ${isComplete && 'is-complete'} ${isLoading && 'is-loading'} `}>
            <div className="loading-container">
                <MouseCursor/>
            </div>
        </div>
    );
}

export default Loading;
