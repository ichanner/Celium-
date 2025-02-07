import "./styles.css"

import React from 'react'
import PostHeader from "./Header/Header"
import PostFooter from "./Footer/Footer"
import PostContent from "./Content/Content"
import { POST_WIDTH_FACTOR, WIDTH } from "../../../utils/constants"

export default (props) =>{

	return(

		<div 

			className='post-container' 

			style={{

				borderTop: `2px solid ${props.color}`, 
				borderLeft: `1px solid ${props.color}`, 
				width: ( WIDTH * POST_WIDTH_FACTOR ),
			}}

		>
			<PostHeader {...props} />

			<PostContent {...props} />

			<PostFooter {...props}/>

		</div>

	)
}


