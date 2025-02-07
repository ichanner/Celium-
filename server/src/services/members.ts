//@ts-nocheck
import 'reflect-metadata'
import { Service, Inject } from "typedi"
import ChatService from "./chat"

@Service()
class MemberService{

	constructor(
		@Inject('membersModel') private membersModel : Models.Members,
		@Inject(() => ChatService) private chatService : ChatService

	){}

	public async createMember(chat_id: string, user_id: string){

	}

	public async removeMember(chat_id: string, user_id: string){

	}


	public async validatePermissions(chat_id: string, user_id: string, requested_permissions: [number]){

		const validated_by_default = await this.chatService.validatePermissions(chat_id, requested_permissions)

		if(!validated_by_default){

			return await this.membersModel.countDocuments({

				chat_id: chat_id, 
				user_id: user_id, 
				permissions: { $in: requested_permissions } 
			})
		}

		return true;
	}
}

export default MemberService;