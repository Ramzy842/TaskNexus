import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import tasksReducer from "./reducers/tasksReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
});

export default rootReducer;
