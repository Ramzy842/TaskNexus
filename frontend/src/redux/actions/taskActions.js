import { store } from "../../main"
import { getUser } from "../../services/users"
import { GET_TASKS_FAILURE, GET_TASKS_REQUEST, GET_TASKS_SUCCESS } from "../types/taskTypes"

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

const getTasks = () => {
    return async dispatch => {
        dispatch(getTasksRequest());
        try {
            const id = localStorage.getItem('id')
            const res = await getUser(id);
            dispatch(getTasksSuccess(res.data.tasks))
        } catch (error) {
            console.log(error);
            dispatch(getTasksFailure(error))
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

export {getTasks}
