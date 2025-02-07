import {Document, Model} from 'mongoose'
import IChat from "../../interfaces/IChat"
import IUser from "../../interfaces/IUser"
import IMessage from "../../interfaces/IMessage"
import IMember from "../../interfaces/IMember"
import {createClient} from 'redis'

declare global{

	export type RedisClient = ReturnType<typeof createClient>

	namespace Models{

		export type User = Model<IUser & Document>
		export type Messages = Model<IMessage & Document>
		export type Members = Model<IMember & Document>
		export type Chats = Model<IChat & Document>

	}

		
}