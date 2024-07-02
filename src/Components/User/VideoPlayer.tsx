import React, { useEffect, useRef } from "react";

interface VideoPlayerProps {
  stream: MediaStream;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      console.log("VideoPlayer: Stream set on video element", stream);
    }

    return () => {
      if (videoRef.current) {
        const currentStream = videoRef.current.srcObject as MediaStream;
        if (currentStream) {
          currentStream.getTracks().forEach((track) => track.stop());
          console.log("VideoPlayer: Stopped stream tracks");
        }
        videoRef.current.srcObject = null;
      }
    };
  }, [stream]);

  return <video ref={videoRef} autoPlay controls />;
};

export default VideoPlayer;
