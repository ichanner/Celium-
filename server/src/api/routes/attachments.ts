//@ts-nocheck
import { Router, Request, Response, NextFunction } from 'express'
import { Container } from 'typedi'
import path from "path"
import config from "../../config/index"
import sharp from 'sharp'
import https from "https"
import mime from "mime-types"

const BUCKET_NAME = config.ATTACHMENTS_BUCKET_NAME

export default (app : Router) =>{

	const router = Router()
	const s3 = Container.get('s3')

	app.use('/attachments', router)

	router.get('/:chat_id/:message_id/:filename/download', async(req: Request, res: Response, next: NextFunction)=>{

		try {

			const { chat_id, message_id, filename } = req.params;

			if (!chat_id || !message_id || !filename) {
				
				return res.status(400).send('Missing required parameters');
			}     


			const file_path = path.join('processed', chat_id, message_id, filename);
			
			const params = { 

				Bucket: BUCKET_NAME, Key: file_path 
			}

			s3.getObject(params, (err, data) => {
			    
			    if (err) {
			      
			      return next(err);
			    }

			    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
			    res.setHeader('Content-Type', data.ContentType);
			    res.setHeader('Content-Length', data.ContentLength);

			    res.send(data.Body);
			
			});
	      	
	    }
	    catch(err){

	    	next(err);
	    }

	})

	router.get('/:chat_id/:message_id/:filename', async(req: Request, res: Response, next: NextFunction)=>{

		try{



			const { chat_id, message_id, filename } = req.params;
			const { format, quality=80, height, width } = req.query;

			if (!chat_id || !message_id || !filename) {
		     
		    	return res.status(400).send('Missing required parameters');
		    }

		    const { name } = path.parse(filename); 
		   	const file_ext = format ? format : filename.split('.').pop();
		   	const file_path = path.join('processed', chat_id, message_id, `${name}.${file_ext}`);
		    const mime_type = mime.lookup(file_path);


		    if(!mime_type){

		    	return res.status(400).send('Invalid mime type!')
		    }

		    const params = { 

		    	Bucket: BUCKET_NAME, Key: file_path 
		    }
		    const stream =  s3.getObject(params).createReadStream();

		    res.writeHead(200, { 'Content-Type': mime_type });

		    if(mime_type.includes('image/')){

		    	let transform = sharp()
		    	
			   	if (quality) {
	                
	                transform = transform.toFormat(file_ext, { quality: quality });
	            } 
	            else {
	                
	                transform = transform.toFormat(file_ext);
	            }

	            if (width && height) {
	                
	                transform = transform.resize({ height: height, width: width });
	            }

		    	stream.pipe(transform).pipe(res)
		    	
		    }
		    else{

		    	stream.pipe(res)
		    }

		}
		catch(err){

			next(err)
		}
	})
}