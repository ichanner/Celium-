
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

const uiSlice = createSlice({

	name: 'messages/ui',
	
	initialState: {

		replying: {},
		drafts: {},
		editing: {}
	},

	reducers:{

		setDraft: (state, { payload: { chat_id, body, attachments }}) =>{

			state.drafts[chat_id] = {body, attachments} 
		},

		setReplying: (state, { payload: { chat_id, message_id, index, username } })=>{

			delete state.drafts[chat_id];

			state.replying[chat_id] = {message_id, username, index}
		},

		removeReplying: (state, { payload: chat_id }) => {

			delete state.replying[chat_id];
				
		}
	}
})

export const { setReplying, removeReplying, setDraft } = uiSlice.actions;

const selectUIState = (state) => state.messages_ui;
const selectReplying = createSelector([selectUIState], (uiState) => uiState.replying)
const selectDrafts = createSelector([selectUIState], (uiState) => uiState.drafts)


export const selectDraftById = (chat_id) => createSelector([selectDrafts], (drafts) => drafts[chat_id] ? drafts[chat_id] : null)
export const selectReplyingById = (chat_id) => createSelector([selectReplying], (replying) => replying[chat_id] ? replying[chat_id] : null)


export default uiSlice.reducer;