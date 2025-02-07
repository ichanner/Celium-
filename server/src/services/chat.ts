//@ts-nocheck
import 'reflect-metadata'
import { Service, Inject } from "typedi"
import { MAX_RESULTS } from '../constants/index'
import Cursor from "../utils/Cursor"

@Service()
class ChatService {

	constructor(
		@Inject('membersModel') private membersModel : Models.Members,
		@Inject('chatsModel') private chatsModel : Models.Members,
	){}

	public async createChat(subject: string, user_id: string){

		//creates the chat 
	}

	public async fetchChats(user_id: string, cursor: string){

		return await this.membersModel.aggregate([

			{ $match: { user_id: user_id } },

			{
				$lookup:{

					from: 'chats',
					localField: 'chat_id',
					foreignField: 'id',
					as: 'chats'
				}
			},

			{ $unwind: '$chats' },

			{
				$replaceRoot: {

					newRoot: '$chats'
				}
			},

			...Cursor.getNextBatch(cursor, MAX_RESULTS, 'chats', [ { field: '_id', order: -1 } ]),

		])
		
	}

	public async validatePermissions(chat_id: string, requested_permissions: [number]){

		return await this.chatsModel.countDocuments({

			chat_id: chat_id, 
			default_permissions: { $in: requested_permissions } 
		}) 
	}

}

export default ChatService