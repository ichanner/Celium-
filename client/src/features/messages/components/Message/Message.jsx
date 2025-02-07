import './styles.css'

import React, { useRef, useContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectMessageById } from "../../messageSlice"
import { selectUser } from "../../../auth/authSlice"
import transfromDate from "../../../../utils/transformDate"
import getDateString from "../../../../utils/getDateString"
import Avatar from "../../../../components/Avatar/Avatar"
import Tooltip from '@mui/material/Tooltip';
import AttachmentGrid from "./Attachments/Grid"
import Footer from "./Footer"
import classNames from "classnames"

export default ({index, chat_id, is_replying, message_id, style, setHeight}) =>{

	const messageRef = useRef(null);

	const { id: user_id } = useSelector(selectUser)
	const { id, username, author_id, creation_date, body, attachments, is_bookmarked } = useSelector(selectMessageById(chat_id, message_id));

	useEffect(()=>{

	    setHeight(index, messageRef)
		
	}, [index, setHeight])


	return (

		<div style={style}>

			<div ref={messageRef} >

				<div  className={classNames('message-container', { 'message-replying-container': is_replying } )}>

					<Avatar user_id={author_id} size={3}/>

					<div className='message-content'>

						<div className='message-header'>

							<span className='username'>{username}</span>

							<Tooltip arrow placement="top" title={getDateString(creation_date)}>

								<span className='timestamp'>{transfromDate(creation_date)}</span>

							</Tooltip>

						</div>

						<span className='message-text'> {body} </span>

						{ attachments.length > 0 && <AttachmentGrid  attachments={attachments}/> } 

						<Footer 

							is_bookmarked={is_bookmarked} 
							is_replying={is_replying}
							is_local={author_id == user_id}
							message_id={id}
							chat_id={chat_id}
							index={index}
							username={username}
						/>

					</div>

				</div>
				
			</div>

		</div>

	)
}