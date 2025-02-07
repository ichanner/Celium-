import {createSlice} from '@reduxjs/toolkit'

const creatorSlice = createSlice({

	name: 'creatorSlice',
	
	initialState: {

		attachments: [],
		body: '',
		upload_progress: 0
	},

	reducers: {

		removeAttachment: (state, action) =>{

			const { attachments } = state;
			const removed_index = action.payload;

			state.attachments = [...attachments.slice(0, removed_index), ...attachments.slice(removed_index+1)]
		},

		selectAttachment : (state, action) =>{

			const { attachments } = state;

			const selected = action.payload
			const index = attachments.findIndex(({uri})=>uri==selected.uri)

			if(index < 0){

				 state.attachments = [...attachments, selected]
			}
			else{

				state.attachments = [...attachments.slice(0, index), ...attachments.slice(index+1)]
			}
		},

		clearValues: (state, action)=>{

			state.attachments = []
			state.body = ''
			state.upload_progress = 0
		},

		setInitialValues: (state, action) =>{

			const { initial_body, initial_attachments } = action.payload

			state.attachments = initial_attachments
			state.body = initial_body
			state.upload_progress = 0
		},

		setUploadProgress: (state, action)=>{

			state.upload_progress = action.payload
		},

		setBody: (state, action)=>{

			state.body = action.payload
		}
	}
})

export const {

	removeAttachment, 
	setUploadProgress, 
	setBody,  
	selectAttachment, 
	clearValues, 
	setInitialValues

} = creatorSlice.actions

export default creatorSlice.reducer