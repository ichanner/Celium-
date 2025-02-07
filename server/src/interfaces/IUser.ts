
export default interface IUser{

	id: string,
	username: string,
	creation_date: number,
	bookmarked_messages: [string] | [],
}