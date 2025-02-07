import * as React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { useSelector } from 'react-redux'

export default ()=>{

	const isAuthenticated = useSelector(selectIsAuthenticated);

	return isAuthenticated ? <Outlet/> : <Navigate to='/login' replace/>
}