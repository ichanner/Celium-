

export default interface IMember{

	user_id: string,
	chat_id: string,
	joined_date: number,
	permissions: [number] | []
}