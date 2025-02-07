import "./styles.css"

import React from 'react'
import config from "../../config/"

export default ({user_id, size})=>{

	return(

		<img 

			className='avatar'  
			alt={"Couldn't Load Image"} 
			src={'https://media.threatpost.com/wp-content/uploads/sites/103/2019/09/26105755/fish-1.jpg'}
			//src={`${config.baseURL}/user/${user_id}/avatar`} 
			style={{width: `${size}rem`, height: `${size}rem`}}
		/>
	)
}