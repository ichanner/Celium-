import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./rootReducer"

const middlewares = [thunk];	

export default createStore(reducers, applyMiddleware(...middlewares));


