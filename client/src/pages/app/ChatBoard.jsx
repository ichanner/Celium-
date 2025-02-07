import './styles.css'
import React, { useEffect } from 'react';
import ChatSideBar from "../../features/chat/components/SideBar"
import MessageList from "../../features/messages/components/MessageList"
import { WIDTH } from "../../constants/"

export default(() => {
  	
  	return (

  		<div className='chat-board-container'>

			<ChatSideBar/>

			<MessageList/>


		</div>

		
  	);

});
