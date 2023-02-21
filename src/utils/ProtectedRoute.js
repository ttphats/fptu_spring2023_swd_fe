import React from 'react'
import {useSelector} from "react-redux"
import {Navigate, useLocation} from "react-router-dom"

const ProtectedRoute = ({children,isAuthenticated}) => {
    const location = useLocation();

    if(!isAuthenticated) {
        console.log(1,isAuthenticated);
        return <Navigate to="/login" state={{ from: location}} replace />
    }
 return children

};

export default ProtectedRoute;