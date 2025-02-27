import {
  ADD_TASK_FAILURE,
  ADD_TASK_REQUEST,
  ADD_TASK_SUCCESS,
  GET_TASKS_FAILURE,
  GET_TASKS_REQUEST,
  GET_TASKS_SUCCESS,
  GET_TASK_FAILURE,
  GET_TASK_REQUEST,
  GET_TASK_SUCCESS,
  RESET_TASK_CREATION,
} from "../types/taskTypes";

const initialState = {
  tasks: [],
  task: null,
  error: null,
  loading: false,
  message: null,
  isCreating: false,
  creationErrors: null,
  //   creationData: {
  //     title: "",
  //     description: "",
  //     dueDate: "",
  //     status: "",
  //   },
};

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TASKS_REQUEST:
      return { ...state, loading: true, message: null, error: null };
    case GET_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        message: null,
        error: null,
        tasks: action.payload,
      };
    case GET_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload.error };
    case GET_TASK_REQUEST:
      return { ...state, loading: true, message: null, error: null };
    case GET_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        message: null,
        error: null,
        task: action.payload,
      };
    case GET_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        task: null,
      };
    case ADD_TASK_REQUEST:
      return {
        ...state,
        isCreating: true,
        creationErrors: null,
        message: action.payload,
      };
    case ADD_TASK_SUCCESS:
      return {
        ...state,
        isCreating: false,
        message: action.payload,
        creationErrors: null,
      };
    case ADD_TASK_FAILURE:
      return {
        ...state,
        isCreating: false,
        creationErrors: action.payload,
        message: null,
      };
    case RESET_TASK_CREATION:
      return {
        ...state,
        isCreating: false,
        creationErrors: null,
        message: null,
      };
    default:
      return state;
  }
};

export default tasksReducer;
