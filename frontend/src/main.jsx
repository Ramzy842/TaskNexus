import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { combineReducers, legacy_createStore as createStore } from "redux";

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "GET_USER":
      return { ...state, ...action.payload };
    case "ADD_TASK":
        return {...state, tasks: [...state.tasks, action.payload]};
    default:
      return state;
  }
};

const taskReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD_TASK":
      return [...state, action.payload];
    case "REMOVE_TASK":
      return state.filter((task) => task.id !== action.payload.id);
    case "EDIT_TASK": {
      const task = state.find((task) => task.id === action.payload.id);
      const newTask = {
        title: action.payload.title || task.title,
        description: action.payload.description || task.description,
        dueDate: action.payload.dueDate || task.dueDate,
        status: action.payload.status || task.status,
      };
      return state.map((task) =>
        task.id !== action.payload.id ? task : newTask
      );
    }
    default:
      return state;
  }
};

const reducer = combineReducers({
  tasks: taskReducer,
  user: userReducer,
});

const store = createStore(reducer);
store.subscribe(() => {
  console.log(store.getState());
});
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
