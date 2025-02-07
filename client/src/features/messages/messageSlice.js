import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { CURSOR_DIRECTIONS } from "./messageConstants"
import messageService from "./messageService"

const { TOP, DOWN, AROUND, SIDE } = CURSOR_DIRECTIONS;


const messageSlice = createSlice({

	name: 'messages',
	
	initialState: {

		messages: {

			'3':
[
  {
    "id": "1",
    "username": "JohnDoe",
    "author_id": "1001",
    "creation_date": 1719525578918,
    "body": "Hey there! This is a message.",
    "attachments": [

    	{url: "https://d2l1drhdg5g91z.cloudfront.net/v1/attachments/3/1/42a1bd89-6b5d-480b-bf0a-2b582171ed63.jpg", height: 800, width: 400, format: 'image/jpeg'},
    	{url: "https://d2l1drhdg5g91z.cloudfront.net/v1/attachments/3/1/94e38dd5-a77b-4eff-b282-eb13e60df7f4.mp4", height: 300, width: 400, format: 'video/mp4'},

   	],
    "is_bookmarked": true
  },
  {
    "id": "2",
    "username": "JaneSmith",
    "author_id": "1002",
    "creation_date": 1719525578918,
    "body": "Hello! How are you?",
    "attachments": [],
    "is_bookmarked": false
  },
  {
    "id": "3",
    "username": "AliceJohnson",
    "author_id": "1003",
    "creation_date": 1719525578918,
    "body": "This is another example message.",
    "attachments": [],
    "is_bookmarked": true
  },
  {
    "id": "4",
    "username": "BobBrown",
    "author_id": "1004",
    "creation_date": 1719525578918,
    "body": "Check out this link: http://example.com",
    "attachments": [],
    "is_bookmarked": false
  },
  {
    "id": "5",
    "username": "CharlieDavis",
    "author_id": "1005",
    "creation_date": 1719525578918,
    "body": "This message has no attachments.",
    "attachments": [],
    "is_bookmarked": false
  },
  {
    "id": "6",
    "username": "EmilyWhite",
    "author_id": "1006",
    "creation_date": 1719525578918,
    "body": "Just wanted to share this amazing article I found on web development. It covers a lot of advanced topics and best practices that are very useful for both beginners and experienced developers.",
    "attachments": [],
    "is_bookmarked": true
  },
  {
    "id": "7",
    "username": "FrankGreen",
    "author_id": "1007",
    "creation_date": 1719525578918,
    "body": "Short message.",
    "attachments": [],
    "is_bookmarked": false
  },
  {
    "id": "8",
    "username": "GraceBlue",
    "author_id": "1008",
    "creation_date": 1719525578918,
    "body": "Here's a detailed guide on how to set up your development environment for a new project. It includes steps for installing necessary software, configuring your IDE, and setting up version control. Make sure to follow each step carefully to avoid any issues.",
    "attachments": [],
    "is_bookmarked": true
  },
  {
    "id": "9",
    "username": "HenryBlack",
    "author_id": "1009",
    "creation_date": 1719525578918,
    "body": "Hey team, I have an update on the project. We are currently ahead of schedule and should be able to complete the initial phase by the end of this week. Keep up the good work!",
    "attachments": [],
    "is_bookmarked": false
  },
  {
    "id": "10",
    "username": "IvyYellow",
    "author_id": "1010",
    "creation_date": 1719525578918,
    "body": "Check out this funny meme!",
    "attachments": [],
    "is_bookmarked": false
  },
  {
    "id": "11",
    "username": "JackRed",
    "author_id": "1011",
    "creation_date": 1719525578918,
    "body": "Reminder: We have a meeting tomorrow at 10 AM. Please be prepared with your updates and any questions you may have.",
    "attachments": [],
    "is_bookmarked": true
  },
  {
    "id": "12",
    "username": "KarenBrown",
    "author_id": "1012",
    "creation_date": 1719525578918,
    "body": "Had a great time at the conference! Learned so much and met some really interesting people. Looking forward to implementing some of the new ideas we discussed.",
    "attachments": [],
    "is_bookmarked": true
  },
  {
    "id": "13",
    "username": "LiamOrange",
    "author_id": "1013",
    "creation_date": 1719525578918,
    "body": "Can someone help me with this issue I'm facing in my code? I've been stuck on it for a while and could use some fresh eyes.",
    "attachments": [],
    "is_bookmarked": false
  },
  {
    "id": "14",
    "username": "MiaPurple",
    "author_id": "1014",
    "creation_date": 1719525578918,
    "body": "Just finished reading this book and I highly recommend it! It's packed with great insights and practical advice.",
    "attachments": [],
    "is_bookmarked": true
  },
  {
    "id": "15",
    "username": "NoahBlue",
    "author_id": "1015",
    "creation_date": 1719525578918,
    "body": "Looking forward to the weekend! What are your plans?",
    "attachments": [],
    "is_bookmarked": false
  }
]




		}, 

		loading_state: {},
	},

	reducers: {

		updated: (state, { payload: { active_chat_id, message_id, new_fields } } )=>{

			state.messages[active_chat_id].map((message)=>{

				if(message.id == message_id){

					return {...message, ...new_fields}
				}

				return message;
			})	
		},

		removed: (state, { payload: { active_chat_id, message_id } } )=>{

			state.messages[active_chat_id].map((message)=>{

				if(message.id == message_id){

					return { ...message, 

						author_id: null, 
						username: '[Deleted]', 
						body: '[Deleted]',	
						attachments: []
					}
				}
			})
		},

		added: (state, { payload:  { active_chat_id, new_message } } )=>{

			state.messages[active_chat_id].push(new_message);
		}

	},

	extraReducers: (builder) =>{


		builder

			.addCase(fetchMessages.fulfilled, (state, { payload: { active_chat_id, new_messages, cursor_direction, message_id } })=>{

				const messages = state.messages[active_chat_id] || [];

				if(cursor_direction == TOP){

					state.messages[active_chat_id] = [ ...new_messages, ...messages ]

				}
				else if(cursor_direction == SIDE){

					state.messages[active_chat_id].map((message)=>{

						if(message.id == message_id){

							return {

								...message, siblings: [ ...message.siblings, ...new_messages ]
							}
						}

						return message;

					})
				}
				else{ //AROUND or DOWN

					const boundary_index = message_id ? messages.findIndex(({id})=> id == message_id) : messages.length;

					state.messages[active_chat_id] = [

						...messages.slice(0, boundary_index + 1), ...new_messages
					]
				}

				state.loading_state[active_chat_id] = null;
			})

			.addCase(fetchMessages.pending, (state, { payload: { active_chat_id, message_id, cursor_direction } } )=>{

				state.loading_state[active_chat_id] = message_id ? message_id : cursor_direction;
			})
	}

})

export const { added, removed, updated } = messageSlice.actions;

export const fetchMessages = createAsyncThunk('messages/fetchMessages', 

	async (active_chat_id, parent_id, message_id, cursor_direction, cursor=null, { dispatch }) => {
    
    	const new_messages = await messageService.fetch(parent_id, cursor_direction, cursor);
    	
    	return { active_chat_id, message_id, new_messages, cursor_direction };
  	}

);

export const removeMessage = ( active_chat_id, message_id )  => async(dispatch, getState) =>{

	await messageService.remove(message_id);

	dispatch(

		removed({ active_chat_id, message_id })
	)
}

export const editMessage = (active_chat_id, message_id, new_fields ) => async(dispatch, getState) =>{

	await messageService.update(message_id, new_fields);

	dispatch( 

		updated({ active_chat_id, message_id, new_fields }) 
	);
}

export const sendMessage = (active_chat_id, replied_message_id, body, attachments) => async(dispatch, getState) =>{
	
	const new_message = await messageService.add(active_chat_id, replied_message_id, body, attachments);

	dispatch(

		added({active_chat_id, new_message})
	)

	return new_message
	

}

const selectMessageState = (state) => state.messages;
const selectMessages = createSelector( [selectMessageState], (messageState) => messageState.messages );
const selectLoadingState = createSelector( [selectMessageState], (messageState) => messageState.loading_state);

export const selectLoadingById = (id) => createSelector( [selectLoadingState], 

	(loading_state) => !!loading_state[id]
);

export const selectMessageIds = (chat_id) => createSelector( [selectMessages], 

	(messages) => messages[chat_id]?.map(({id}) => id) || []
);

export const selectMessageById = (chat_id, message_id) => createSelector( [selectMessages], 

	(messages) => messages[chat_id]?.find(({id}) => id === message_id)
);

export const selectSiblingIds = (chat_id, message_id) => createSelector( [selectMessageById(chat_id, message_id)], 

	(message)=> message?.siblings.map(({id}) => id)
)

export const selectSiblingById = (chat_id, message_id, sibling_id) => createSelector( [selectMessageById(chat_id, message_id)], 

	(message) => message?.siblings.find(({id})=> id == sibling_id)
)


export default messageSlice.reducer;





	