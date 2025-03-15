import {
  createTask,
  getTask,
  removeTask,
  updateTask,
} from "../../services/tasks";
import { retrieveTasks } from "../../services/users";

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
    // dispatch(resetTasks());
    dispatch(getTasksRequest());
    try {
      const id = localStorage.getItem("id");
      const res = await retrieveTasks(id);
      console.log(res);
      if (!res.success && res.error) dispatch(getTaskFailure(res.error));
      else dispatch(getTasksSuccess(res.data));
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
      if (!res.success && res.error) dispatch(getTaskFailure(res.error));
      else dispatch(getTaskSuccess(res.data));
    } catch (error) {
      dispatch(getTaskFailure(error.response.data.message));
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
      const res = await createTask({
        title,
        description,
        dueDate,
        status,
      });
      if (!res.success && res.error) dispatch(addTaskFailure(res.error));
      else dispatch(addTaskSuccess(res.message));
    } catch (error) {
      dispatch(addTaskFailure(error.response.data.errors));
    }
  };
};

const resetTaskCreation = () => {
  return {
    type: RESET_TASK_CREATION,
  };
};
// ------------------------------------------------------------------ //

const deleteTaskRequest = () => {
  return {
    type: DELETE_TASK_REQUEST,
  };
};

const deleteTaskSuccess = () => {
  return {
    type: DELETE_TASK_SUCCESS,
  };
};

const deleteTaskFailure = (error) => {
  return {
    type: DELETE_TASK_FAILURE,
    payload: error,
  };
};

const deleteTask = (id) => {
  return async (dispatch) => {
    dispatch(deleteTaskRequest());
    try {
      await removeTask(id);
      dispatch(deleteTaskSuccess());
      dispatch(getTasks());
    } catch (error) {
      dispatch(deleteTaskFailure(error.response.data.message));
    }
  };
};
// ------------------------------------------------------------------ //

const editTaskRequest = () => {
  return {
    type: EDIT_TASK_REQUEST,
  };
};

const editTaskSuccess = (updatedTask, message) => {
  return {
    type: EDIT_TASK_SUCCESS,
    payload: {
      task: updatedTask,
      message,
    },
  };
};

const editTaskFailure = (error) => {
  return {
    type: EDIT_TASK_FAILURE,
    payload: error,
  };
};

const editTask = (id, data) => {
  return async (dispatch) => {
    dispatch(editTaskRequest());
    try {
      const res = await updateTask(id, data);
      if (!res.success && res.error) dispatch(editTaskFailure(res.error));
      else {
        dispatch(editTaskSuccess(res.data, res.message));
        // dispatch(getTaskData(id));
        // dispatch(getTasks())
      }
    } catch (error) {
      console.log(error.response.data.errors);
      dispatch(editTaskFailure(error.response.data.errors));
    }
  };
};

const resetTasks = () => {
  return {
    type: RESET_TASKS,
  };
};

export {
  getTasks,
  getTaskData,
  addTask,
  editTask,
  deleteTask,
  resetTaskCreation,
  deleteTaskFailure,
  resetTasks,
};
