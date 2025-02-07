//@ts-nocheck
import express from "express"
import http from "http"
import {Container} from "typedi"
import initMongoose from "./mongoose"
import initExpress from "./express"
import initInjection from "./injection"
import initWebSocket from "./socket"
import config from "../config/index"
import initJobs from "./jobs"
import initRedis from "./redis"
import initAWS from "./aws"

const Model = (name: string, file:string) =>{

	return {name, model: require(`../models/${file}`).default}
}

export default async(app : express.Application, server : http.Server)=>{

	const models = 	[

		Model('userModel', "user"),
		Model('messagesModel', 'message'),
		Model('membersModel', 'member'),
		Model('chatsModel', 'chat')
	]

	const connection = await initMongoose(config.DB_URI)
	const redisClient = await initRedis()
	const { s3, mediaConvert } = await initAWS();
	const { io, pubClient } = await initWebSocket(server, redisClient)
	const { agenda } = await initInjection(connection, io, redisClient, pubClient, models, s3, mediaConvert)

	await initJobs(agenda)
	await initExpress(app)

}