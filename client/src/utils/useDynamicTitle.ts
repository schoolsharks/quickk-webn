import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if the current path starts with /admin
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    // Set the document title based on the route
    if (isAdminRoute) {
      document.title = 'Webn Admin';
    } else {
      document.title = 'Webn';
    }
  }, [location.pathname]);
};

export default useDynamicTitle;
