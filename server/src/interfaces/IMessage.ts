import IAttachment from "./IAttachment"

export default interface IMessage{

	id: string,
	parent_id: string,
	author_id: string,
	chat_id: string,
	attachments: [IAttachment] | [],
	body: string,
	creation_date: number, 
	edit_date: number | null,
	is_processed: boolean,
	leaf_depth: number,
	leaf_creation_date: number,
	leaf_expired: boolean
}