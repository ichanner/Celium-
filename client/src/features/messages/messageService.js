import xhrRequest from "../../services/xhrRequest";
import axios from "../../services/axiosClient";
import getAttachment from "../../utils/getAttachment";
import getEncodedCursor from "../../utils/getEncodedCursor";

const messageService = {

	remove: async (message_id) => {

		await axios.delete(`/messages/${message_id}`);
	},

    update: async (message_id, new_fields) => {
    
	    await axios.patch(`/messages/${message_id}`, new_fields);
  	},

	add: async (chat_id, replied_message_id, body, attachments) => {

		try{

			const uploadCallback = ({loaded, total}) => {

				const event = new CustomEvent('uploadProgress', { progress: (loaded/total)*100 })

				window.dispatchEvent(event);
			}
	    
		    const formData = new FormData();
		    
		    for (let attachment of attachments) {
		     		     
		      formData.append('files', attachment.file);
		    }

	
		    formData.append('body', body);
		    formData.append('replied_message_id', replied_message_id);
		    formData.append('chat_id', chat_id)
		    
		    const response = await xhrRequest("/messages", formData, 'POST', ()=>{});
		   
		   
		    return JSON.parse(response);
		}
		catch(err){
			console.log(err)
			//TODO: handle error
		}
	},

	fetch: async (parent_id, direction, cursor=null) => {

		try{

		  	const encoded_cursor = getEncodedCursor(cursor)
			const response = await axios.get(`/messages/${parent_id}/context?cursor_direction=${direction}&cursor=${encoded_cursor}`);

		    return response.data;
		}
		catch(err){

			throw err;
		}
	}

}


export default messageService;


 


