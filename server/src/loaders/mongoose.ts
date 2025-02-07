//@ts-nocheck
import mongoose, { ConnectOptions } from 'mongoose'

export default async(connection_string : string) =>{

	const options: ConnectOptions = { 

		useNewUrlParser: true, 
		useUnifiedTopology: true 
	}

	const { connection } = await mongoose.connect(connection_string, options)

	return connection

}