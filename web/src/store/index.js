import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import wsMiddleware from "./middleware/socket"
import appReducer from "./app/reducer"
import createReducer from "./create/reducer"
import postsReducer from './board/posts/reducer'
import fullScreenReducer from "./board/fullscreen/reducer"
import menuReducer from "./board/menu/reducer"
import popupReducer from "./app/popup/reducer"

const reducers = combineReducers({

	postsSlice: postsReducer,  
	fullScreenSlice: fullScreenReducer,
	menuSlice: menuReducer,
	appSlice: appReducer, 
	popupSlice: popupReducer,
	creatorSlice: createReducer
});

const middlewares = [thunk, wsMiddleware];	

export default createStore(reducers, applyMiddleware(...middlewares));


