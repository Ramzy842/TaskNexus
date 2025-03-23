const tasksRouter = require("express").Router();
const { validationResult } = require("express-validator");
const Task = require("../models/Task");
const User = require("../models/User");
const { verifyToken } = require("../utils/middleware");
const { responseMessages } = require("../utils/responseMessages");
const {
  validateTitle,
  validateDescription,
  validateStatus,
  validateDate,
  validateTitleUpdate,
  validateDescriptionUpdate,
  validateStatusUpdate,
  validateDateUpdate,
} = require("../utils/tasksValidators");

tasksRouter.get("/", async (req, res, next) => {
  try {
    const tasks = await Task.find({}).populate("userId");
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

tasksRouter.get("/:id", verifyToken, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task)
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: responseMessages.tasks.toRetrieveNotFound,
      });
    if (req.user.id !== task.userId.toString())
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: responseMessages.tasks.accessUnauthorized,
      });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

tasksRouter.post(
  "/",
  [validateTitle, validateDescription, validateStatus, validateDate],
  verifyToken,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({
        success: false,
        statusCode: 400,
        errors: result.array().map((res) => res.msg),
      });
    try {
      const { title, description, status, dueDate } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: true,
          statusCode: 404,
          message: responseMessages.users.accessUnauthorized,
        });
      }
      const newTask = new Task({
        title,
        description, 
        status,
        dueDate,
        userId: user.id,
        order: user.tasks.length,
      });
      const task = await newTask.save();
      user.tasks = user.tasks.concat(task.id);
      await user.save();
      res.status(201).json({
        success: true,
        statusCode: 201,
        data: task,
        message: responseMessages.tasks.creationSuccess,
      });
    } catch (error) {
      next(error);
    }
  }
);

tasksRouter.put(
  "/:id",
  [
    validateTitleUpdate,
    validateDescriptionUpdate,
    validateStatusUpdate,
    validateDateUpdate,
  ],
  verifyToken,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).json({
        success: false,
        statusCode: 400,
        errors: result.array().map((res) => res.msg),
      });
    if (!Object.keys(req.body).length) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: responseMessages.tasks.emptyBody,
      });
    }
    try {
      const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!task) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: responseMessages.tasks.toUpdateNotFound,
        });
      }
      if (req.user.id !== task.userId.toString())
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: responseMessages.tasks.updateUnauthorized,
        });
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: task,
        message: responseMessages.tasks.updateSuccess,
      });
    } catch (error) {
      next(error);
    }
  }
);

tasksRouter.delete("/:id", verifyToken, async (req, res, next) => {
  try {
    // Find the task first
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: responseMessages.tasks.toDeleteNotFound,
      });
    }

    // Check if the user is authorized to delete it
    if (req.user.id !== task.userId.toString()) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: responseMessages.tasks.deletionUnauthorized,
      });
    }

    // Delete the task after confirming ownership
    await Task.findByIdAndDelete(req.params.id);

    // Find the user and update their tasks array
    const user = await User.findById(req.user.id).populate("tasks");
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: responseMessages.users.accessUnauthorized,
      });
    }

    console.log("User tasks before deletion:", user.tasks);

    // Filter out the deleted task and reorder remaining tasks
    user.tasks = user.tasks
      .filter((task) => task.id !== req.params.id)
      .map((task, index, array) => ({
        ...task.toObject(),
        order: array.length - 1 - index, // Reorder
      }));

    await user.save();

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});


module.exports = tasksRouter;
