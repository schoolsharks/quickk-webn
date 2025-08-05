import React from 'react'
import VideoPlayer from '../../features/learning/components/user/VideoComponent'
import { useParams } from 'react-router-dom';

const VideoComponentPage:React.FC = () => {
    const { url } = useParams<{ url: string }>();
    console.log(`url- ${url}`);
  return (
    <VideoPlayer videoUrl={url as string}/>
  )
}

export default VideoComponentPage;