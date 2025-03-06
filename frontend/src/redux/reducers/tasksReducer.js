import {
    ADD_TASK_FAILURE,
    ADD_TASK_REQUEST,
    ADD_TASK_SUCCESS,
    DELETE_TASK_FAILURE,
    DELETE_TASK_REQUEST,
    DELETE_TASK_SUCCESS,
    EDIT_TASK_FAILURE,
    EDIT_TASK_REQUEST,
    EDIT_TASK_SUCCESS,
    GET_TASKS_FAILURE,
    GET_TASKS_REQUEST,
    GET_TASKS_SUCCESS,
    GET_TASK_FAILURE,
    GET_TASK_REQUEST,
    GET_TASK_SUCCESS,
    RESET_TASKS,
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
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                task: null,
            };
        case GET_TASK_REQUEST:
            return {
                ...state,
                loading: true,
                message: null,
                error: null,
                task: null,
            };
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
        case DELETE_TASK_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case DELETE_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                task: null,
            };
        case DELETE_TASK_FAILURE:
            return {
                ...state,
                loading: false,
                message: action.payload,
            };
        case EDIT_TASK_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case EDIT_TASK_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case EDIT_TASK_SUCCESS:
            return {
                ...state,
                task: action.payload.task,
                message: action.payload.message,
                loading: false,
            };
        case RESET_TASKS:
            return initialState
        default:
            return state;
    }
};

export default tasksReducer;
