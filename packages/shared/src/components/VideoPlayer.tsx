import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = ({ url }: VideoPlayerProps) => {
  return (
    <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-lg">
      <ReactPlayer
        // @ts-ignore
        url={url}
        className="absolute top-0 left-0"
        width="100%"
        height="100%"
        controls
        playing={false}
      />
    </div>
  );
};

export default VideoPlayer;
