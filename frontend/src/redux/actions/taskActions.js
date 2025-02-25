import { store } from "../../main"
import { getTask } from "../../services/tasks"
import { getUser } from "../../services/users"
import { GET_TASKS_FAILURE, GET_TASKS_REQUEST, GET_TASKS_SUCCESS, GET_TASK_FAILURE, GET_TASK_REQUEST, GET_TASK_SUCCESS } from "../types/taskTypes"

const getTasksSuccess = (tasks) => {
    return {
        type: GET_TASKS_SUCCESS,
        payload: tasks
    }
}
const getTasksRequest = () => {
    return {
        type: GET_TASKS_REQUEST
    }
}

const getTasksFailure = (error) => {
    return {
        type: GET_TASKS_FAILURE,
        payload: {
            error
        }
    }
}

const getTaskSuccess = (tasks) => {
    return {
        type: GET_TASK_SUCCESS,
        payload: tasks
    }
}
const getTaskRequest = () => {
    return {
        type: GET_TASK_REQUEST
    }
}

const getTaskFailure = (error) => {
    return {
        type: GET_TASK_FAILURE,
        payload: {
            error
        }
    }
}


const getTasks = () => {
    return async dispatch => {
        dispatch(getTasksRequest());
        try {
            const id = localStorage.getItem('id')
            const res = await getUser(id);
            console.log(res);
            dispatch(getTasksSuccess(res.data.tasks))
        } catch (error) {
            console.log(error);
            dispatch(getTasksFailure(error))
        }
    }
}

const getTaskData = (id) => {
    return async dispatch => {
        dispatch(getTaskRequest());
        try {
            const res = await getTask(id);
            console.log(res);
            dispatch(getTaskSuccess(res.data))
        } catch (error) {
            console.log(error);
            dispatch(getTaskFailure(error))
        }
    }
}
// ------------------------------------------------------------------ //
const updateTask = (id) => {

}
// ------------------------------------------------------------------ //
const deleteTask = (id) => {

}
// ------------------------------------------------------------------ //
const editTask = (id) => {

}

export {getTasks, getTaskData}
