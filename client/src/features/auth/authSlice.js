import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';

const authReducer = createSlice({

	name: 'auth',

	initialState:{

		isAuthenticated: true,
		user: {user_id: '123'},
		token: null
	},

	reducers:{}

})

export const selectAuthState = (state) => state.auth;
export const selectIsAuthenticated = createSelector( [selectAuthState], (authState) => authState.isAuthenticated);
export const selectUser = createSelector( [selectAuthState], (authState) => authState.user )


export default authReducer.reducer;