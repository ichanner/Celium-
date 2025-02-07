export default ((uri) => { 

	let format;

	const split_path = uri.split("/")	
	const filename = split_path[split_path.length-1]
	const splits = filename.split('.')
	const ext = splits[splits.length-1]

	if(ext == 'mp4' || ext == 'mov' || ext == 'webm'){

		format = `video/${ext}`
	}
	else if (ext == 'png' || ext == 'jpg' || ext == 'gif'){

		format = `image/${ext}`
	}
	else{

		throw Error('Unsupported File Format');
	}


	return {

		uri: uri, 
		name: filename, 
		format: format 
	}
})
