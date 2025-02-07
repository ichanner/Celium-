//@ts-nocheck
import aws from "aws-sdk"
import config from "../config"

export default async() => {

	aws.config.update({

		accessKeyId: config.AWS_ACCESS_KEY_ID,
	    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
	    region: config.AWS_REGION
	})

	aws.config.logger = console.log
	
	const getMediaConvertEndpoint = async() => {

		const mediaConvert = new aws.MediaConvert({ apiVersion: config.MEDIA_CONVERT_API_VERSION });

		try {
		    
		    const { Endpoints } = await mediaConvert.describeEndpoints({ MaxResults: 0 }).promise();
		    
		    if (Endpoints.length > 0) {
		      
		      console.log("Your MediaConvert endpoint is ", Endpoints[0].Url);
		      
		      return Endpoints[0].Url;
		    } 
		    else {

		      throw new Error("No endpoints found");
			}
		}
		catch (err) {
		
			console.error("MediaConvert Error", err);
		
		  	throw err;
		}
	}

	const mediaConvertEndpoint = await getMediaConvertEndpoint(); 

	const mediaConvert = new aws.MediaConvert({
	  
	    apiVersion: config.MEDIA_CONVERT_API_VERSION,
	    endpoint: mediaConvertEndpoint,
	
	});

	const s3 = new aws.S3();

	return {s3, mediaConvert}
}