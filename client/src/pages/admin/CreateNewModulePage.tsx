import React from 'react'
import CreateNewModule from '../../features/learning/components/admin/CreateNewModule'
import { useGetCompleteModuleByIdQuery } from '../../features/learning/service/learningApi';
import { useParams } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import ErrorLayout from '../../components/ui/Error';

const CreateNewModulePage : React.FC= () => {
   const { moduleId } = useParams<{ moduleId: string }>();
    
    const {data : module , isError,isLoading} = useGetCompleteModuleByIdQuery(moduleId);
    if(isLoading){
      return <Loader/>
    }
  
    if(isError){
      return <ErrorLayout/>
    }

  return (
    <CreateNewModule module={module?.data}/>
  )
}

export default CreateNewModulePage