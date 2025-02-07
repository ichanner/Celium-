//@ts-nocheck
import express, {Router, Response, Request, NextFunction} from 'express'
import { Container } from 'typedi'
import { uploadAttachment } from "../middleware/upload"
import { MAX_ATTACHMENTS } from "../../constants/index"
import messageService from "../../services/messages"
import isAuth from "../middleware/isAuth"

export default (app : Router) =>{

	const router = Router()
	const MessageService : messageService = Container.get(messageService)
	const s3 = Container.get('s3')

	app.use('/messages', router)

	router.get('/:message_id/context', isAuth, async(req : Request, res : Response, next : NextFunction)=>{

		try{
		
			const { message_id } = req.params;
			const { cursor_direction, cursor } = req.query;
			const { id: user_id } = req.user;

			const messages = await MessageService.fetchMessages(message_id, user_id, cursor_direction, cursor);
			
			res.json(messages).end();

		}
		catch(err){

			next(err);
		}
	})

	router.delete('/:message_id', isAuth, async(req : Request, res : Response, next : NextFunction)=>{

		try{

			const { message_id } = req.params;
			const { id: user_id } = req.user;

			await MessageService.deleteMessage(message_id, user_id);

			res.end();
		}
		catch(err){

			next(err)
		}
	})

	router.patch('/:message_id', isAuth, async(req : Request, res : Response, next : NextFunction)=>{

		try{

			const { message_id } = req.params;
			const { id: user_id } = req.user;

			await MessageService.editMessage(message_id, user_id, req.body);

			res.end()
		}
		catch(err){

			next(err)
		}
	})

	///*uploadAttachment(s3).array('files', MAX_ATTACHMENTS),*/

	router.post('/', isAuth,uploadAttachment(s3).array('files', MAX_ATTACHMENTS), async(req : Request, res : Response, next : NextFunction)=>{

		try{

			const { body, replied_message_id, chat_id } = req.body;
			const { id: user_id, username } = req.user;
			const { attachments = [] } = req;

			const new_message = await MessageService.createMessage(chat_id, replied_message_id, user_id, username, body, attachments);
			
			res.json(new_message).end();
		}
		catch(err){

			next(err)
		}
	})
}


/*
	router.get('/:parent_id/siblings', isAuth, async(req : Request, res : Response, next : NextFunction)=>{

		try{
		
			const { parent_id } = req.params;
			const { cursor } = req.query;
			const user_id = req.user.id;
			const posts = await PostsService.fetchSiblings(parent_id, cursor, user_id);
			
			res.json(posts).end();

		}
		catch(err){

			next(err);
		}
	})
	*/

