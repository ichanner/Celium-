import express, { Router, Response, Request, NextFunction } from 'express'
import { Container } from 'typedi'
import isAuth from "../middleware/isAuth"
import chatService from "../../services/chat"
import memberService from "../../services/members"


export default (app : Router) => {

	const router = Router()
	const ChatService = Container.get(chatService);
	const MemberService = Container.get(memberService);

	app.use('/chats', router);

	router.get('/', isAuth, async(req: Request, res: Response, next: NextFunction)=>{

		try{

			const { cursor } = req.query;
			const { id: user_id } = req.user;

			const chats = await ChatService.fetchChats(user_id, cursor);

			res.json(...chats).end();
		}
		catch(err){

			next(err);
		}
	})


	//router.post('/:chat_id/members')

	//router.delete('/:chat_id/members')

}