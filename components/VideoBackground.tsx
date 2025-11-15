
import React, { useState, useEffect } from 'react';

const videoSources = [
  'https://videos.pexels.com/video-files/853896/853896-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/5781919/5781919-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/8043644/8043644-hd_1920_1080_25fps.mp4',
];

const VideoBackground: React.FC = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
  };

  useEffect(() => {
    videoSources.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = src;
      document.head.appendChild(link);
    });
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <video
        key={currentVideoIndex}
        className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
        src={videoSources[currentVideoIndex]}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      />
    </div>
  );
};

export default VideoBackground;