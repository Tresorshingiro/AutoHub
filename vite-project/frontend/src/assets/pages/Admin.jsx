import React from 'react';
import AdminNav from '../components/AdminNav';
import '../../App.css';
import { useAuthContext } from '../hooks/useAuthContext';

const Admin = () => {
  const { user } = useAuthContext()

  const handleLogout = (e) => {
    logout();
    location.href = '/'
  }

  return(
    <div className="container">
      <AdminNav/>
    </div>
   
  );
};
export default Admin;