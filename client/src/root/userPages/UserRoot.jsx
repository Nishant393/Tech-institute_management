import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useUserContext } from '../../Provider/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserRoot = () => {
  const navigate = useNavigate()
  const {getAuthUser , isAdmin , isAuthanticated } = useUserContext()
  useEffect(()=>{
    getAuthUser()
    if(true){
      navigate("./admin/dashboard")
      console.log("navigate")
    }
  },[])
  return (
    <>
        UserRoot<br/>
        <Outlet/>
    </>
  );
};

export default UserRoot;