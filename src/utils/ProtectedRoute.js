import React from 'react'
import {Navigate, useLocation} from "react-router-dom"

const ProtectedRoute = ({children,loginInfo}) => {
    const location = useLocation();
    if((loginInfo == null && !localStorage.getItem('access-token') )) {
        console.log("Is Authen",loginInfo);
        return <Navigate to="/login" state={{ from: location}} replace />
    }
 return children
};

export default ProtectedRoute;