import axios from "../../services/axiosClient";
import getEncodedCursor from "../../utils/getEncodedCursor"

const chatService = {
 
    fetch: async(cursor) => {

      try{

          const encoded_cursor = getEncodedCursor(cursor);
          const response = await axios.get(`/chats?cursor=${encoded_cursor}`);

          return response.data;
       }
       catch(err){

         throw err;
       }
       
    },

    create: async(subject, message_id) => {

      const response = await axios.post(`/chats`, { subject, message_id });

      return response.data;
    }
};

export default chatService;
