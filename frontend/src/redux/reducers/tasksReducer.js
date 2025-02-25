import { GET_TASKS_FAILURE, GET_TASKS_REQUEST, GET_TASKS_SUCCESS, GET_TASK_FAILURE, GET_TASK_REQUEST, GET_TASK_SUCCESS } from "../types/taskTypes";

const initialState = {
    tasks: [],
    task: null,
    error: null,
    loading: false,
    message: null
}

const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TASKS_REQUEST:
            return {...state, loading: true, message: null, error: null}
        case GET_TASKS_SUCCESS:
            return {...state, loading: false, message: null, error: null, tasks: action.payload}
        case GET_TASKS_FAILURE:
            return {...state, loading: false, error: action.payload.error}
        case GET_TASK_REQUEST:
            return {...state, loading: true, message: null, error: null}
        case GET_TASK_SUCCESS:
            return {...state, loading: false, message: null, error: null, task: action.payload}
        case GET_TASK_FAILURE:
            return {...state, loading: false, error: action.payload.error, task: null}
        default:
            return state;
    }
}

export default tasksReducer;