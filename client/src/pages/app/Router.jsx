import * as React from "react";
import { Routes, Route } from "react-router-dom";
import ChatBoard from "./ChatBoard"
import Settings from "./Settings"

export default(()=>{

	return (

		<Routes>

			<Route path="/:id" element={<ChatBoard/>}/>

			<Route path="/settings" element={<Settings/>}/>

		</Routes>
		
	)

})