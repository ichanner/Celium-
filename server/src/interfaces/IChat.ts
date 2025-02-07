export default interface IMember{

	id: string,
	creator_id: string,
	subject: string,
	creation_date: number,
	default_permissions: [number] | []

}