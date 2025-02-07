import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'

const modalSlice = createSlice({

	name: 'modal',
	
	initialState: {

		type: null,
		modal_props: {}
	},
	
	reducers:{

		toggleOpen: (state, { payload })=>{

			if(state.type == null){

				const { props, type } = payload;

				state.modal_props = props;
				state.type = type;
			}
			else{

				state.type = null;
			}
		}	
	}

});

export const { toggleOpen } = modalSlice.actions;

export default modalSlice.reducer;

const selectModalState = (state) => state.modal;

export const selectModalType = createSelector([selectModalState], (modalState) => modalState.type);
export const selectModalProps = createSelector([selectModalState], (modalState) => modalState.modal_props);

 