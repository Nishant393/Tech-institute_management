import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Provider/AuthContext';
import Navbar from '../../component/Navbar';
import Footer from '../../component/Footer';

const UserRoot = () => {
  const navigate = useNavigate();
  const { getAuthUser, isAdmin, isAuthanticated ,isLoading  } = useUserContext();
  
 

    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow pt-16">
          <Outlet />
        </div>
        <Footer />
      </div>
    );
  
};

export default UserRoot;