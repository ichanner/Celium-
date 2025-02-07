import dotenv from 'dotenv'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const env = dotenv.config()

if(env.error){

	throw new Error("Unable to load ENV!")
}

export default{

	DB_URI: process.env.DB_URI as string,
	PORT: process.env.PORT,
	SOCKET_PORT: process.env.SOCKET_PORT,
	REDIS_PORT: process.env.REDIS_PORT,
	SESSION_SECRET: process.env.SESSION_SECRET,
	API_PREFIX: process.env.API_PREFIX,
	HOSTNAME: process.env.HOSTNAME,
	SOCKET_HOST: process.env.SOCKET_HOST,
	GOOGLE_CLIENT_ID: process.env.CLIENT_ID,
	GOOGLE_CLIENT_SECRET: process.env.CLIENT_SECRET,
	ATTACHMENTS_BUCKET_NAME: process.env.ATTACHMENTS_BUCKET_NAME,
	AVATARS_BUCKET_NAME: process.env.AVATARS_BUCKET_NAME,
	ASSETS_BUCKET_NAME: process.env.ASSETS_BUCKET_NAME,
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
	AWS_REGION: process.env.AWS_REGION,
	AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
	CDN_HOSTNAME: process.env.CDN_HOSTNAME,
	MEDIA_CONVERT_API_VERSION: process.env.MEDIA_CONVERT_API_VERSION
}
