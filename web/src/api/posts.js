import axios from "./index"
import queryBuilder from "./utils/queryBuilder"
import xhrRequest from "./utils/xhr"
import fileStats from "../utils/fileStats"
import {Attachment} from "../utils/formats"

export default () => {

	const remove = async(post_id) =>{

		try{
			
			await axios().delete(`/posts/${post_id}`)
		}
		catch(err){

			console.log(err)
		}
	}

	const edit = async(post_id, new_body, new_attachments)=>{

		try{

			await axios().patch(`/posts/${post_id}`, {

				new_body: new_body,
				new_attachments: new_attachments
			})
		}
		catch(err){

			console.log(err)
		}
	}

	const traverse = async(parent_id, direction)=>{

		try{
					
			const query = queryBuilder(`/posts/${parent_id}/traverse`, { direction })
			
			return await axios().get(query);
		}
		catch(err){

			console.log(err)
		}
	}

	const fetchSiblings = async(parent_id, cursor)=>{

		try{
					
			const query = queryBuilder(`/posts/${parent_id}/siblings`, { cursor })
			
			return await axios().get(query);
		}
		catch(err){

			console.log(err)
		}
	}


	const post = async(replied_post_id, body, attachments, uploadCallback)=>{

		try{

			const formData = new FormData()

		    for(let attachment of attachments){

			   const {type, filename} = fileStats(attachment.uri)
			
			   formData.append('files', Attachment(attachment.uri, filename, type))
		    }

			formData.append('body', body)
			formData.append('replied_post_id', replied_post_id)

			const response = await xhrRequest("/posts/create", formData, 'POST', uploadCallback)
		
			return JSON.parse(response)
		}
		catch(err){

			console.log(err)
		}
	}

}
