import mongoose, {Schema, Document} from 'mongoose'
import IMessage from "../interfaces/IMessage"

const Attachment = new Schema({

	id: {type: String},
	format: {type: String},
	filename: {type: String},
	url: {type: String, default: ""},
	size: {type: Number, default: 0},
	height: {type: Number, default: null},
	width: {type: Number, default: null}
})

const Message = new Schema({

	id: {type: String, required: true, index: 'text'},
	parent_id: {type: String, required: true},
	chat_id: {type: String, default: 'root'},
	author_id: {type: String, required: true},
	body: {type: String, default: null},
	creation_date: {type: Number, required: true},
	edit_date: {type: Number, default: null},
	attachments: {type: [Attachment], default: []},
	is_processed: {type: Boolean, default: false},
	leaf_depth: {type: Number, default: 0}, // deepest leaf depth in the tree 
	leaf_date: {type: Number, required: true}, // average of leaf creation dates 
	leaf_expired: {type: Boolean, default: false} // if all leafs are older than 8 minutes


})

export default mongoose.model<IMessage & Document>("Message", Message)