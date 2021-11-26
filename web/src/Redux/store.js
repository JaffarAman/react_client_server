import { applyMiddleware, createStore } from "redux";
import reducers from "./Reducer";
import thunk from "redux-thunk";

const store  = createStore(reducers , {} , applyMiddleware(thunk))
export default  store;