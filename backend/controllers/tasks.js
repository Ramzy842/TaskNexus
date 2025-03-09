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
    //   if (!user) {
    //     return res.status(404).json({
    //       success: true,
    //       statusCode: 404,
    //       message: responseMessages.users.accessUnauthorized,
    //     });
    //   }
    //   const lastTask = await Task.findOne({ userId: req.user.id }).sort(
    //     "-order"
    //   );
    //   const newOrder = lastTask ? lastTask.order + 1 : 0;
      const newTask = new Task({
        title,
        description,
        status,
        dueDate,
        userId: user.id,
        // order: newOrder,
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
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task)
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: responseMessages.tasks.toDeleteNotFound,
      });
    if (req.user.id === task.userId.toString()) return res.status(204).end();
    else
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: responseMessages.tasks.deletionUnauthorized,
      });
  } catch (error) {
    next(error);
  }
});

tasksRouter.put("/reorder", verifyToken, async (req, res, next) => {
  const { updatedTasks } = req.body;

  try {
    for (let x = 0; x < updatedTasks.length; x++) {
      await Task.findByIdAndUpdate(updatedTasks[x].id, { order: x });
    }
    res.status(200).json({ message: "Tasks reordered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reorder tasks" });
  }
});

module.exports = tasksRouter;
