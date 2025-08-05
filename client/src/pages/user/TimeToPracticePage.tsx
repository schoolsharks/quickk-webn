import React, { useEffect } from 'react';
import TimeToPractice from '../../features/learning/components/user/TimeToPractice';
import { useParams } from 'react-router-dom';

const TimeToPracticePage: React.FC = () => {
      const { moduleId } = useParams<{ moduleId: string }>();
      useEffect(() => {
         window.scrollTo(0, 0);
      },[])
    return (
       <TimeToPractice
       moduleId={moduleId}/>
    );
};

export default TimeToPracticePage;