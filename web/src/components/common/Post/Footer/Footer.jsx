import React from 'react'
import LikeButton from './LikeButton'
import BridgeButton from './BridgeButton'
import ReplyButton from './ReplyButton'
import './styles.css'


export default ({

		id,
		author_id, 
		likes, 
		bridges, 
		is_liked,  
		username	
		
	})=>{

	return(

		<div className='footer-container'>

			{ ( author_id != null ) ? 

				<>
					<LikeButton likes={likes} is_liked={is_liked}  post_id={id} />

					<ReplyButton post_id={id} username={username} />

					<BridgeButton post_id={id} bridges={bridges}/> 

				</> : null
			}

		</div>
	)
}