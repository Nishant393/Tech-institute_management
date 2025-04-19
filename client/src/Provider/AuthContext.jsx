import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import server from '../cofig/config';

const INITIAL_STATE = {
    user: {
        id: "",
        name: "",
        email: "",
        role: "user",
        mobileNumber: ""
    },
    isAuthanticated: false,
    setIsAuthenticated: () => false,
    isAdmin: false,
    getAuthUser:()=> 0,
    isLoading:true
}

const AuthContext = createContext(INITIAL_STATE);


function AuthProvider({ children }) {
    const [user, setUser] = useState({
        id: "",
        name: "",
        email: "",
        role: "user",
        mobileNumber: ""
    })
    const [isAuthanticated, setIsAuthenticated] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()




    const getAuthUser = async () => {
        try {
            await axios
                .get(`${server}user/me`, { withCredentials: true })
                .then((data) => {
                    setUser(
                        {
                            ...user,
                            id: data?.data.user._id,
                            name: data?.data.user.name,
                            email: data?.data.user.email,
                            isAdmin: data?.data.user.isAdmin,
                            mobileNumber: data?.data.user.mobileNumber,
                        }
                    )
                    console.log(data)
                    if (data?.data.user.isAdmin) {
                        setIsAdmin(true)
                    } else { setIsAdmin(false) }
                    if (data.data.success) {
                        setIsAuthenticated(true)
                    } 
                    
                })
                .catch((e) => {
                    setIsAdmin(false)
                    setIsAuthenticated(false)
                    console.log(e)
                })
        } catch (error) {
            return error
        } finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAuthUser()
    }, [])

    const values = {
        user,
        isAdmin,
        isAuthanticated,
        setIsAuthenticated,
        getAuthUser,
        isLoading
    }
    return (

        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useUserContext = () => useContext(AuthContext)