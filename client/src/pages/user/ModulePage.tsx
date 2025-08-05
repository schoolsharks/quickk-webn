import React from 'react'
import ModuleLayout from '../../features/learning/components/user/ModuleLayout'
import { useParams } from 'react-router-dom';
import { useGetModuleQuery } from '../../features/learning/service/learningApi';
import { Box, CircularProgress, Typography } from '@mui/material';

const ModulePage :React.FC = () => {

  const { moduleId } = useParams<{ moduleId: string }>();
  const { data: module, error: moduleError, isLoading: moduleLoading } = 
    useGetModuleQuery(moduleId as string);

  // Loading state
  if (moduleLoading ) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Error state
  if (moduleError) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}>
        <Typography color="error">Failed to load module data</Typography>
      </Box>
    );
  }


  if (!module) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}>
        <Typography color="error">Module data is missing</Typography>
      </Box>
    );
  }
 
  
  return (
    <ModuleLayout 
    moduleId={moduleId}
    content={module.content}
    type={module.type}
    title={module.title}
    isVideoWatched= {module.isVideoWatched}/>
  )
}

export default ModulePage;

