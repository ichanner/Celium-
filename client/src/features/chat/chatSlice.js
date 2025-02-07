import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import chatService from "./chatService"


const chatSlice = createSlice({

	name: 'chats',
	
	initialState: {

		chats:[], 

		loading: false,

		next_cursor: null
	},

	
	reducers:{

		added: ( state, { payload: { chats } } )=>{

			state.chats.unshift(chats)
		},

		removed: (state, { payload: chat_id })=>{

			state.chats = state.chats.filter(({id}) => id != chat_id)
		}
	},

	extraReducers: (builder)=>{

		builder

			.addCase(fetchChats.fulfilled, (state, { payload: { chats, next_cursor } })=>{

				state.next_cursor = next_cursor;
				state.chats = [...state.chats, ...chats];
				state.loading = false;
			}) 

			.addCase(fetchChats.pending, (state, action)=>{

				state.loading = true;
			})

	}
})

export const { added, removed } = chatSlice.actions;

export const fetchChats = createAsyncThunk('chats/fetchChats', 

	async (cursor=null, { dispatch }) => {

    	const response = await chatService.fetch(cursor);

    	return response;
  	}
);


export const createChat = (subject, message_id) => async(dispatch, getState) =>{

	const new_chat = await chatService.create(message_id);

	dispatch(added(new_chat))
}


const selectChatsState = (state) => state.chats;

const selectChats = createSelector( [selectChatsState ], (chatState) => chatState.chats )

export const selectChatIds = createSelector( [selectChats], 

	(chats) => chats.map(chat => chat.id)
);

export const selectChatById = (chat_id) => createSelector( [ selectChats ],
    
    (chats) => chats.find(chat => chat.id === chat_id)
);

export const selectLoading = createSelector( [selectChatsState ], (chatState) => chatState.loadng);

export const selectNextCursor = createSelector( [selectChatsState ], (chatState) => chatState.next_cursor);

export default chatSlice.reducer;


//








