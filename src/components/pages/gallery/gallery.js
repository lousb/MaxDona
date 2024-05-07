import React, {useState, useRef} from "react";
import ReactPlayer from "react-player/lazy";
import './gallery.css'
import MouseCursor from '../../../utils/mouseCursor';
import YouTube from 'react-youtube';





function Gallery(){

          

    return(
        <div className="gallery-page">
            <MouseCursor/>
            <div className="video-container">
            <div className="player__wrapper">
                <CustomYouTubePlayer />
            </div>
            </div> 
        </div>
  
    )
}




const CustomYouTubePlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  const videoId = 'xuQhwS6j18s';

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      controls: 0, // Hide YouTube controls
      modestbranding: 1, // Remove YouTube logo
      fs: 0, // Hide full screen button
      rel: 0, // Hide related videos at the end
    }
  };

  const onReady = (event) => {
    // Set up event listener to handle play/pause
    event.target.addEventListener('onStateChange', (e) => {
      if (e.data === window.YT.PlayerState.PLAYING) {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    });
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      playerRef.current.internalPlayer.pauseVideo();
    } else {
      playerRef.current.internalPlayer.playVideo();
    }
  };

  return (
    <div className="player" onClick={togglePlayPause}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
    
        ref={playerRef}
        
      />
      <p onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</p>
    </div>
  );
};


export default Gallery;