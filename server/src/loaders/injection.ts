import { Container } from 'typedi'
import { Server } from 'socket.io'
import { EventDispatcher } from 'event-dispatch'
import { Connection } from 'mongoose'
import { createClient } from 'redis'
import Agenda from 'agenda'

//TODO: type connection, I gave up. The mongoose Docs are either outdated or lying
export default async(
	connection, io: Server, redisClient: ReturnType<typeof createClient>, pubClient: ReturnType<typeof createClient>, 

	models: {name : string, model: any}[], s3, mediaConvert
) =>{

	for(let model of models){

		Container.set(model.name, model.model)
	}

	const agenda: Agenda = new Agenda({mongo: connection.db})
	const dispatcher: EventDispatcher = new EventDispatcher()
	
	Container.set('client', connection.client)
	Container.set('database', connection.db)
	Container.set('agenda', agenda)
	Container.set('io', io)
	Container.set('redisClient', redisClient)
	Container.set('pubClient', pubClient)
	Container.set('eventDispatcher', dispatcher)
	Container.set('s3', s3)
	Container.set('mediaConvert', mediaConvert)

	return {agenda: agenda}
	
}