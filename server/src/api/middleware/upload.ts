//@ts-nocheck
import multer from 'multer'
import multerS3 from "multer-s3"
import config from "../../config/index"
import { v4 as uuid } from "uuid"
import { Container } from "typedi"
import Attachment from "../../utils/Attachment"
import sharp from 'sharp'
import ffmpeg from "fluent-ffmpeg"
import path  from 'path'

const avatar_storage  = (s3) => { 

	return multerS3({

		s3: s3,
		acl: 'public-read',
		bucket: config.AVATARS_BUCKET_NAME,

		key: (req, file, cb) => {

	        const filename = file.originalname
	        const user_id = req.user.id
	        const filepath = `/${user_id}/${filename}`
	       
	        cb(null, filepath);
		}
	})
}

const attachment_storage = (s3) => {

	return multerS3({

	    s3: s3,
	    acl: 'private',
	    bucket: config.ATTACHMENTS_BUCKET_NAME,

	    key: (req, file, cb) => {

	    	try{ 
	       
		        const attachment_id = uuid();
		        const ext = path.extname(file.originalname);
		        const filename = `${attachment_id}${ext}`;
		        const format = file.mimetype
		        const attachment = {filename, format, id: attachment_id};

		        if (!req.attachments) {

		            req.attachments = [attachment];
		        } 
		        else {

		            req.attachments.push(attachment);
		        }

		        console.log(filename)

		        cb(null, `temp/${filename}`);
		    }
		    catch(err){

		    	console.log(err)

		    	cb(err, null)
		    }
	    },
	});

}

export const uploadAttachment = (s3) => multer({storage: attachment_storage(s3)})
export const uploadAvatar = (s3) => multer({storage: avatar_storage(s3)})


/*
if (format.startsWith('image/')) {

		        	console.log(file)
		           
		           	const { width, height } = await sharp(file.buffer).metadata();
		           
		            attachment.width = width;
		            attachment.height = height;
	        	}
	        	else if(format.startsWith('video/')){

	        		ffmpeg.ffprobe(pathToYourVideo, function(err, metadata) {

					    if (err) {

					        console.error(err);

					    } else {
					        
					    	const { width, height } = metadata

					        attachment.width = width;
					        attachment.height = height;
					    }
					
					});
	 
	        	}

	    metadata: (req, file, cb) => {
	     
	       cb(null, {

	            fieldName: file.fieldname,
	            originalName: file.originalname,
	            mimeType: file.mimetype,
	            size: file.size.toString(), 
	            uploadDate: new Date().toISOString()
	       
	        });
	    },

	    */
