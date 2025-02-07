import { combineReducers } from "redux";
import chatSlice from "../features/chat/chatSlice"
import messageSlice from "../features/messages/messageSlice"
import messagesUISlice from "../features/messages/uiSlice"
import authSlice from "../features/auth/authSlice"
import modalSlice from "./modalSlice"


export default combineReducers({

	chats: chatSlice,
	messages: messageSlice,  
	messages_ui: messagesUISlice,
	modal: modalSlice,
	auth: authSlice
});