import { createTask, getTask } from "../../services/tasks";
import { getUser } from "../../services/users";
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

const getTasksSuccess = (tasks) => {
  return {
    type: GET_TASKS_SUCCESS,
    payload: tasks,
  };
};
const getTasksRequest = () => {
  return {
    type: GET_TASKS_REQUEST,
  };
};

const getTasksFailure = (error) => {
  return {
    type: GET_TASKS_FAILURE,
    payload: {
      error,
    },
  };
};

const getTaskSuccess = (tasks) => {
  return {
    type: GET_TASK_SUCCESS,
    payload: tasks,
  };
};
const getTaskRequest = () => {
  return {
    type: GET_TASK_REQUEST,
  };
};

const getTaskFailure = (error) => {
  return {
    type: GET_TASK_FAILURE,
    payload: {
      error,
    },
  };
};

const getTasks = () => {
  return async (dispatch) => {
    dispatch(getTasksRequest());
    try {
      const id = localStorage.getItem("id");
      const res = await getUser(id);
      dispatch(getTasksSuccess(res.data.tasks));
    } catch (error) {
      dispatch(getTasksFailure(error));
    }
  };
};

const getTaskData = (id) => {
  return async (dispatch) => {
    dispatch(getTaskRequest());
    try {
      const res = await getTask(id);
      dispatch(getTaskSuccess(res.data));
    } catch (error) {
      dispatch(getTaskFailure(error));
    }
  };
};

// ------------------------------------------------------------------ //

const addTaskRequest = () => {
  return {
    type: ADD_TASK_REQUEST,
  };
};

const addTaskSuccess = (message) => {
  return {
    type: ADD_TASK_SUCCESS,
    payload: message,
  };
};

const addTaskFailure = (error) => {
  return {
    type: ADD_TASK_FAILURE,
    payload: error,
  };
};

const addTask = (title, description, dueDate, status) => {
  return async (dispatch) => {
    dispatch(addTaskRequest);
    try {
      console.log(title, description, dueDate, status);
      const res = await createTask({ title, description, dueDate, status });
      console.log(res);
      dispatch(addTaskSuccess(res.message));
      // dispatch(getTasks());

    } catch (error) {
      dispatch(addTaskFailure(error.response.data.errors));
    }
  };
};

const resetTaskCreation = () => {
  return {
    type: RESET_TASK_CREATION
  }
}
// ------------------------------------------------------------------ //
const deleteTask = (id) => {};
// ------------------------------------------------------------------ //
const editTask = (id) => {};

export { getTasks, getTaskData, addTask, editTask, deleteTask, resetTaskCreation };
