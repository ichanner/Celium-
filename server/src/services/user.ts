//@ts-nocheck
import 'reflect-metadata'
import { Service, Inject } from "typedi"

@Service()
export default class UserService{

	constructor(
		@Inject('client') private client : MongoClient,
		@Inject('userModel') private userModel : Models.User,
	){}

	public async fetchUser(user_id : string){

		return await this.userModel.findOne({id: user_id}).lean();
	}

}


