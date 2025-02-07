//@ts-nocheck
import 'reflect-metadata'
import { v4 as uuid } from 'uuid'
import { MAX_RESULTS, CURSOR_DIRECTIONS, PERMISSIONS } from "../constants/index"
import { Inject, Service } from 'typedi'
import Agenda from 'agenda'
import IMessage from "../interfaces/IMessage"
import IAttachment from "../interfaces/IAttachment"
import UserService from "./user"
import MemberService from "./members"
import EventDispatcher from "../utils/eventDispatcher"
import Cursor from "../utils/Cursor"
import processAttachments from "../jobs/processAttachments"


const { TOP, DOWN, AROUND, SIDE } = CURSOR_DIRECTIONS;
const { WRITE } = PERMISSIONS

const SIBLING_CURSOR_FIELDS = [
			
	{field: 'leaf_expired', order: 1},
	{field: 'leaf_depth', order: -1},
	{field: 'leaf_date', order: 1}
]

@Service()
class MessageService{

	constructor(
		@Inject('messagesModel') private messagesModel : Models.Messages,
		@Inject('agenda') private agenda : Agenda,
		@Inject('redisClient') private redis : RedisClient,
		@Inject(() => EventDispatcher) private eventDispatcher: EventDispatcher,
		@Inject(() => UserService) private userSevice : UserService,
		@Inject(() => MemberService)  private memberService : MemberService
	){}


	private fetchSiblings(parent_id: string, cursor: string, local_user_id: string){

		return [

			{
				$match:{

					parent_id: parent_id
				}
			},

			...Cursor.getNextBatch(cursor, MAX_RESULTS, 'messages', SIBLING_CURSOR_FIELDS, this.fetchUserInfo(local_user_id))

		]
	}

	private fetchChildren(parent_id: string, local_user_id: string){

		const EXPIRY = 8*60;

		return [

			{ $match: { id: parent_id } },

			//Perform lookup to find all children from parent
			
			 {
	            $graphLookup:{
	            
	                from: 'messages',
	                startWith: parent_id,
	                connectFromField: 'id',
	                connectToField: 'parent_id',
	                maxDepth: MAX_RESULTS - 1,
	                depthField: 'level',
	                as: 'children'
	            }
	        },

	     	{ $unwind: '$children' },

	        {
	        	$facet:{

	        		unprocessed_nodes: [

	        			{ $match: { 'children.is_processed': false } },

	        			{
	        				$graphLookup:{

	        					from: 'messages',
	        					startWith: '$children.id',
	        					connectFromField: 'id',
	        					connectToField: 'parent_id',
				                depthField: 'level',
				                as: 'grandchildren'
	        				}
	        			},

	        			{
	        				$addFields: {
	        					
	        					'children.leaf_depth': { $max: '$grandchildren.level' },
	        					'children.leaf_date': { $max: '$grandchildren.creation_date' }
	        				}
	        			},

	        			{
	        				$addFields:{

	        					'children.leaf_expired': {

	        						$gt: [ { $subtract: [ new Date(), EXPIRY ] }, '$children.leaf_date' ]
	        					}
	        				}
	        			}
	        		],

	        		processed_nodes:[

	        			{ $match: { 'children.is_processed': true } }
	        		]
	        	}
	        },

	        {
	        	$project:{

	        		children: { $concatArrays: [ '$processed_nodes', '$unprocessed_nodes' ] }
	        	}
	        },

	        { $unwind: '$children' },

	        {
	        	$group:{

	        		_id: '$children.parent_id',  //Groups children by their parent

	        		children: { 

	        			$topN:{

	        				n: MAX_RESULTS + 1,  // Select top (MAX_RESULTS + 1) children for each parent group

	        				sortBy: { 

	        					leaf_expired: 1,
	        					leaf_depth: -1, // Sort by 'leaf_depth' descending (deeper nodes first)
	        					leaf_date: 1 // Sort by 'leaf_date' ascending (earlier dates first)
	        				},

	        				output: '$children' // Include the entire 'children' document in the output
	        			} 
	        		}
	        	}
	        },

	        {
	        	$set:{

	        		children: {

    					$slice:['$children', 0,  MAX_RESULTS + 1]
	        		}
	        	}	
	        },

	        {
	        	$unwind: '$children'
	        },

	        { $sort: { 'children.level': 1, 'children.leaf_expired': 1, 'children.leaf_depth': -1, 'children.leaf_date': 1 } },
	        
	        ...this.fetchUserInfo(local_user_id, 'children'),

	        {

	        	$group:{

	        		_id: null, messages: { $push: '$children' }
	        	}
	        }, 
	       
	        {
	        	$addFields:{

		        	longest_path:{

		        		$reduce:{

		        			input: '$messages',

		        			initialValue: [],

		        			in:{

		        				$cond: {

		        					if: { 

		        						$or:[

		        							{ $eq: [ { $size: '$$value' }, 0 ] }, //first group, initialValue is []
		        							{ $eq: [ { $arrayElemAt: ['$$value.id', -1] }, '$$this.parent_id' ] }
		        						]
		        					},

		        					then: { $concatArrays:[ '$$value', ['$$this'] ] },

		        					else: {

			        					$cond:{

					        				if: {  

					        					$eq: [ { $arrayElemAt: ['$$value.parent_id', -1] }, '$$this.parent_id' ] 

					        				}, //they are siblings 
					        				
					        				then: {

					        					 $concatArrays: [ 

					        					 	 { $slice: ['$$value', {$abs: { $subtract: [{ $size: "$$value" }, 1] } } ] }, 

						        					 [{
						        					 	$mergeObjects:[ 

						        					 		{ $arrayElemAt:['$$value', -1] },

						        					 		{ 
						        					 			siblings: { 

						        					 				$concatArrays: [  

						        					 					{
						        					 						$ifNull: [
		                                                                    
		                                                                    	{
		                                                                    		$let:{

		                                                                    			vars: {
		                                                                    			
		                                                                    				prev: { $arrayElemAt:['$$value', -1] }
		                                                                    			},

		                                                                    			in: { $arrayElemAt:['$$prev.siblings', -1] }		
		                                                                    		}
		                                                                    	},	
		                                                                    
		                                                                    	[] 
		                                                                    ]
		                                                            	},
						        					 				
						        					 					['$$this'] 
						        					 				] 
						        					 			} 
						        					 		}
						        					 	]
						        					}] 
					        					 ]
					        				},
					        				
					        				else: '$$value'
				        				}
			        				}
		        				}
		        			}
		        		}
		        	}
		        }
	        },

	        { $unwind: '$longest_path' },

	        {
	        	$replaceRoot: {

	        		newRoot: '$longest_path'
	        	}
	        }, 

	       	{
	       		$set:{

	        		siblings:{

	        			...Cursor.getNextCursor('siblings', MAX_RESULTS, SIBLING_CURSOR_FIELDS)
	        		}
	        	}	
        	}
	        	   
		]		
	}	

	private fetchAncestors(parent_id: string, local_user_id: string){
	    
	    return [

	    	{ $match:{ id: parent_id } },
	        
	        {
	            $graphLookup:{
	            
	                from: 'messages',
	                startWith: parent_id,
	                connectFromField: 'parent_id',
	                connectToField: 'id',
	                maxDepth: MAX_RESULTS - 1,
	                depthField: 'level',
	                as: 'ancestry'
	            }
	        },
	       
	        {
	            $unwind: '$ancestry'
	        },


	        { $sort: { 'ancestry.level': 1} },
	       	
	        ...this.fetchUserInfo(local_user_id, 'ancestry'),
	        
	        //find siblings for each ancestor node:

	        {

	        	$lookup:{

	        		from: 'messages',

	        		let: { ancestor_parent_id: '$ancestry.parent_id', ancestor_id: '$ancestry.id' },

	        		pipeline: [

	        			{
	        				$match:{

	        					$expr:{

	        						$and:[

	        							{ $eq: ['$parent_id', '$$ancestor_parent_id' ] },

	        							{ $ne: ['$id', '$$ancestor_id' ] }
	        						]
	        					}
	        				}
	        			}
	        		],

	        		as: 'siblings'
	        	}
	        },

	        {
	        	$unwind: { 

	        		path: '$siblings', 
	        		preserveNullAndEmptyArrays: true 
	        	}
	        },

	         { 
				$sort: { 
			    	
			    	'siblings.leaf_expired': 1, 
			    	'siblings.leaf_depth': -1,
			    	'siblings.leaf_date': -1
				}
			},

			{ $limit: MAX_RESULTS + 1 },

			...this.fetchUserInfo(local_user_id, 'siblings'),

			{
				$group:{

					_id: '$ancestry.parent_id',

					ancestry: { $first: '$ancestry' },
					
					siblings: { $push: '$siblings' }
				}
			},

			{
				$addFields:{

					'ancestry.siblings': '$siblings'
				}
			},

			{ $replaceRoot: { newRoot: '$ancestry' } },

			{
	       		$set:{

	        		siblings:{

	        			...Cursor.getNextCursor('siblings', MAX_RESULTS, SIBLING_CURSOR_FIELDS)
	        		}
	        	}	
        	}
	    ]
	}

	private fetchUserInfo(local_user_id: string, field: string = "" ) {

		const prefix = field != "" ? `${field}.` : ""

		return [

			//fetches local user info
			{
				$lookup: {

					from: 'users',
					
					let: { message_id: `$${prefix}id` },
					
					pipeline: [

						{
							$match:{ 

								$expr:{ $eq:['$id', local_user_id] }  
							}
						},

						{
							$project:{

								is_bookmarked: { $in: ['$$message_id', '$bookmarked_messages'] }
							}
						}

					],
					
					as: 'local_user_info'
				}
			},

			//fetches author info
			{
				$lookup: {

					from: 'users',
					
					let:{ 

						author_id: `$${prefix}author_id`
					},
					
					pipeline: [

						{
							$match:{ 

								$expr:{ $eq:['$id','$$author_id']  }  
							},
						},

						{
							$project:{

								username: 1
							}
						},
					],
					
					as: 'author_info'
				}
			},

			{

				$addFields:{


					[`${prefix}username`]: { $arrayElemAt: ['$author_info.username', 0] },
					[`${prefix}is_bookmarked`]: { $arrayElemAt: ['$local_user_info.is_bookmarked', 0] }
				}
			}
		]
	}

	public async fetchMessages(parent_id: string, user_id: string, cursor_direction: number, cursor: string | null){

		let pipeline = [];

		if(cursor_direction == TOP){

			pipeline = this.fetchAncestors(parent_id, user_id)
		}
		else if(cursor_direction == DOWN){

			pipeline = this.fetchChildren(parent_id, user_id)
		}
		else if(cursor_direction == AROUND){

			pipeline = [

				{
					$facet:{

						ancestors: this.fetchAncestors(parent_id, user_id),
						children: this.fetchChildren(parent_id, user_id),
					}
				},

				{
					$project:{

						messages: {$concatArrays:[ '$ancestors', '$children']}
					}
				},

				{ $unwind: '$messages' },

				{
					$replaceRoot:{

						newRoot: '$messages'
					}
				}

			]
		}
		else if(cursor_direction == SIDE){

			pipeline = this.fetchSiblings(parent_id, cursor, user_id); 
		}

		return await this.messagesModel.aggregate(pipeline);

	}

	public async fetchMessage(message_id: string, user_id: string){

		return await messagesModel.aggregate([

			{ $match: { id: message_id } },

			...this.fetchUserInfo(user_id)
		])
	}

	public async editMessage(message_id: string, editor_id: string, fields: { new_body?:string, removed_attachments?: string[] } ){

		const { author_id } = await this.fetchMessage(message_id);

		if(author_id == editor_id){

			let updated_fields = { 

				edit_date: Date.now(), 

				$pull: { 

					attachments: { 

						id: { $in: attachments} 
					} 
				}	
			}

			if(new_body !== undefined){

				updated_fields.body = new_body
			}

			await this.messagesModel.updateOne({id: message_id}, updated_fields)

			if(removed_attachments.length > 0) {

				/*

				this.agenda.now('deleteAttachments', {

					attachments: removed_attachments
				})
				*/
			}

		}
		else{

			throw new Error("Unauthorized")
		}

		
	}

	public async deleteMessage(message_id : string, deleter_id : string){

		const { attachments, author_id } = await this.fetchMessage(message_id);
		
		if(author_id == deleter_id){

			await this.messagesModel.updateOne({id: message_id}, {

				body: '[Deleted]',
				attachments: [],
				author_id: null,
				edit_date: null
			})

			if(attachments.length > 0) {

				/*

				this.agenda.now('deleteAttachments', {

					attachments: attachments
				})

				*/
			}
		}
		else{

			throw new Error("Unauthorized")
		}
	}	

	public async createMessage(chat_id: string, replied_message_id: string, author_id: string, author_username: string, body: string, attachments: [IAttachment] | []){

		const can_write = await this.memberService.validatePermissions(chat_id, author_id, [WRITE])

		if(can_write){

			const message_id = uuid();
			const current_date = Date.now();
			
			const message = await this.messagesModel.create({

				id: message_id,
				parent_id: replied_message_id,
				author_id: author_id,
				body: body,
				attachments: attachments,
				chat_id: chat_id,
				creation_date: current_date,
				leaf_date: current_date
			});

			const new_message = { ...message._doc, 

				username: author_username,
				is_bookmarked: false
			}

			await processAttachments(chat_id, message_id, attachments)

			return new_message;
			
			//await this.eventDispatcher.emitTo(chat_id, 'messages:added', new_message);


			//dispatch leaf calculations job
			//dispatch file processing job

		
		}
		else{

			throw new Error("Unauthorized") 
		}

	}


}


export default MessageService
