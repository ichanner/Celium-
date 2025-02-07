import mongoose, {Schema, Document} from 'mongoose'
import IChat from "../interfaces/IChat"

const Chat = new Schema({

	id: {type: String, required: true},
	creator_id: {type: String, required: true},
	subject: {type: String, default: 'New Chat'},
	default_permissions: {type: [Number], default: []},
	creation_date: {type: Number, required: true}
})


export default mongoose.model<IChat & Document>("Chat", Chat, 'chats')