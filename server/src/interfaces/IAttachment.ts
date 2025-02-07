export default interface IAttachment{

	id: string,
	format: string,
	filename: string,
	size: number,
	url?: string,
	height?: number,
	width?: number
}