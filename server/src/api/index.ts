import express, {Router} from 'express'
import registerAuth from "./routes/auth"
import registerUsers from "./routes/users"
import registerMessages from "./routes/messages"
import registerAttachments from "./routes/attachments"
import registerChats from "./routes/chats"

export default () =>{

	const router = Router()

	registerChats(router);
	registerMessages(router)
	registerAttachments(router)
	registerAuth(router)
	registerUsers(router)

	return router
}