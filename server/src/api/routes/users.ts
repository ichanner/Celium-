import express, {Router, Response, Request, NextFunction} from 'express'
import {Container} from 'typedi'
import path from "path"
import fs from 'fs'
import {uploadAvatar} from "../middleware/upload"
import isAuth from "../middleware/isAuth"
import userService from "../../services/user"
import config from "../../config/index"

export default (app : Router) =>{

	const router = Router()
	const UserService = Container.get(userService)

	app.use('/users', router)

	router.get('/:id/avatar', isAuth, async(req: Request, res: Response, next: NextFunction)=>{

		/*
		const user_id = req.params.id;

		const file_path = path.join(config.AVATARS_BUCKET_NAME, `${user_id}.jpg`)

		try{

			if(!user_id){

				throw new Error('Unable to find avatar');
			}

			fs.open(file_path, 'r', (err, descriptor)=>{

				if(err){

					return res.status(404).end();
				}

				const stream = fs.createReadStream(file_path)
				
				res.set('Content-Type', `image/jpg`)
				
				stream.pipe(res)

				fs.close(descriptor, (err)=>{

					if(err) throw err;
				})
			})
			
		}
		catch(err){

			next(err)
		}
		*/
		
	})
	router.get('/:id', isAuth, async(req: Request, res: Response, next: NextFunction)=>{

		try{

			const user_id = req.params.id;
			const user = await UserService.fetchUser(user_id)

			res.json(user).end()
		}
		catch(err){

			next(err);
		}
	})

	
}
