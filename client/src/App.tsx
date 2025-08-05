import React from 'react';
import "./App.css";
import { Routes,
   Route,
   Navigate
   } from 'react-router-dom';
import UserMain from './pages/user/UserMain';
import AdminMain from './pages/admin/AdminMain';
// import NotFoundPage from './components/ui/NotFoundPage';

const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/user/*" element={<UserMain/>}/>
        <Route path="/admin/*" element={<AdminMain/>} />
        <Route path="*" element={<Navigate to="/user/onboarding"/>}/>
        
        
        {/* 404 page */} 
        {/* <Route path="*" element={<NotFoundPage />} />  */}
      </Routes>
  );
};

export default App;