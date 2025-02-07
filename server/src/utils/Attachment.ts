export default(id : string, format: string, filename: string, size: number, url?: string, height?: number, width?: number) =>{

	return{

		id: id,
		format: format,
		filename: filename,
		size: size,
		url: url,
		height: height,
		width: width
	}
}