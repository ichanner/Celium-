//import processAttachments from '../jobs/processAttachments'
//import deleteAttachments from "../jobs/deleteAttachments"

import Agenda from 'agenda'

export default async(agenda : Agenda) =>{

	//agenda.define('processAttachments', processAttachments)
	//agenda.define('deleteAttachments', deleteAttachments)

	await agenda.start()
}