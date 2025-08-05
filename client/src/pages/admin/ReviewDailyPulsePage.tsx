import React from 'react'
import ReviewDailyPulseLayout from '../../features/dailyPulse/components/admin/ReviewDailyPulseLayout'
import Loader from '../../components/ui/Loader';
import ErrorLayout from '../../components/ui/Error';
import { useParams } from 'react-router-dom';
import { useGetDailyPulseByIdQuery } from '../../features/dailyPulse/dailyPulseApi';

const ReviewDailyPulsePage : React.FC = () => {
  const { dailyPulseId } = useParams<{ dailyPulseId: string }>();
    
    const {data : dailyPulse , isError,isLoading} = useGetDailyPulseByIdQuery(dailyPulseId);
    if(isLoading){
      return <Loader/>
    }
  
    if(isError){
      return <ErrorLayout/>
    }
  return (
    <ReviewDailyPulseLayout PulseData={dailyPulse?.data} />
  )
}

export default ReviewDailyPulsePage