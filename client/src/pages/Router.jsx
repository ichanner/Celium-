import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Router from "./app/Router"
import Login from "./auth/Login"
import Register from "./auth/Register"
import ProtectedRoute from "./ProtectedRoute"

export default(()=>{

	return (

		<div>

			<BrowserRouter>

				<Routes>

					<Route path="/login" element={ <Login/> }/>

					<Route path="/register" element={ <Register/> }/>

					<Route element={ <ProtectedRoute/> }>

						<Route path={'/*'} element={ <Router/> }/>

					</Route>

				</Routes>

			</BrowserRouter>

		</div>
	)

})