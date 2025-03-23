const usersRouter = require("express").Router();
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { verifyToken } = require("../utils/middleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const {
  validateUsername,
  validateName,
  validateEmail,
  validatePassword,
  validateUsernameUpdate,
  validateEmailUpdate,
  validateNameUpdate,
  validateOldPasswordUpdate,
  validateNewPasswordUpdate,
  messages,
} = require("../utils/usersValidators");
const { getHashedPassword, createUser } = require("../utils/users");
const { responseMessages } = require("../utils/responseMessages");
const bcrypt = require("bcrypt");
const { limiter, client, s3_bucketName } = require("../utils/config");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const Task = require("../models/Task");
usersRouter.post(
  "/",
  limiter.users,
  [validateUsername, validateName, validateEmail, validatePassword],
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        errors: result.array().map((res) => res.msg),
      });
    }
    if (Object.keys(req.body).length !== 4)
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: responseMessages.users.bodyPayloadLengthError,
      });
    try {
      const { username, name, email, password } = req.body;
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          statusCode: 409,
          message: responseMessages.users.usedEmail,
        });
      }
      const passwordHash = await getHashedPassword(password);
      const savedUser = await createUser(username, name, email, passwordHash);
      await savedUser.save();
      delete savedUser.passwordHash;
      res.status(201).json({
        success: true,
        statusCode: 201,
        data: savedUser,
        message: responseMessages.users.successfullRegistration,
      });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/", limiter.users, async (req, res, next) => {
  try {
    const users = await User.find({}).populate("tasks");
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:id", limiter.users, verifyToken, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id)
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: responseMessages.users.accessUnauthorized,
      });
    const user = await User.findById(req.params.id).populate("tasks");
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: responseMessages.users.toRetrieveNotFound,
      });
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.put(
  "/:id",
  limiter.users,
  [validateUsernameUpdate, validateEmailUpdate, validateNameUpdate],
  verifyToken,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        errors: result.array().map((res) => res.msg),
      });
    }
    if (!Object.keys(req.body).length) return res.status(400).end();
    if (
      Object.keys(req.body).some(
        (key) => key !== "username" && key !== "email" && key !== "name"
      )
    ) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: responseMessages.users.bodyInvalidFields,
      });
    }
    if (req.user.id !== req.params.id)
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: responseMessages.users.updateUnauthorized,
      });
    try {
      if (req.body.email) {
        const emailExists = await User.findOne({
          email: req.body.email,
        });
        if (emailExists) {
          return res.status(409).json({
            success: false,
            statusCode: 409,
            message: responseMessages.users.usedEmail,
          });
        }
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: responseMessages.users.toUpdateNotFound,
        });
      }
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: updatedUser,
        message: responseMessages.users.updateSuccess,
      });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete(
  "/:id",
  limiter.users,
  verifyToken,
  async (req, res, next) => {
    try {
      if (req.params.id !== req.user.id)
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: responseMessages.users.deletionUnauthorized,
        });
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: responseMessages.users.toDeleteNotFound,
        });
      }
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: responseMessages.users.deletionSuccess,
      });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.put(
  "/:id/update-password",
  limiter.users,
  [validateOldPasswordUpdate, validateNewPasswordUpdate],
  verifyToken,
  async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        errors: result.array().map((res) => res.msg),
      });
    }
    if (req.user.id !== req.params.id)
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: responseMessages.users.updateUnauthorized,
      });
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: responseMessages.users.toUpdateNotFound,
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!isMatch)
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Old password is incorrect.",
        });
      const passwordHash = await getHashedPassword(newPassword);
      user.passwordHash = passwordHash;
      await user.save();
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Password updated successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/:id/tasks",
  limiter.getTasksLimit,
  verifyToken,
  async (req, res, next) => {
    try {
      if (req.params.id !== req.user.id)
        return res.status(403).json({
          success: false,
          statusCode: 403,
          message: responseMessages.users.accessUnauthorized,
        });
      const user = await User.findById(req.params.id).populate({
        path: "tasks",
        // options: { sort: { order: -1 } },
      });
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: responseMessages.users.toRetrieveNotFound,
        });
      }
      console.log("tasks: ", user.tasks);
      const orderedTasks = user.tasks.map((task, index) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        userId: task.userId,
        order: user.tasks.length - index - 1,
      }));
      res.status(200).json({
        success: true,
        statusCode: 200,
        data: orderedTasks,
      });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.post(
  "/:id/profile-picture",
  limiter.profilePicture,
  verifyToken,
  upload.single("avatar"),
  async (req, res, next) => {
    if (req.params.id !== req.user.id)
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message:
          "You are not authorized to update this user's profile picture.",
      });
    try {
      const avatar = req.file;
      const params = {
        Bucket: s3_bucketName,
        Key: `profile-picture-${req.user.id}`,
        Body: avatar.buffer,
        ContentType: avatar.mimetype,
      };
      const command = new PutObjectCommand(params);
      await client.send(command);
      const imageKey = `profile-picture-${req.user.id}`;
      await User.findByIdAndUpdate(
        req.params.id,
        { profilePicture: imageKey },
        { new: true }
      );
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: responseMessages.users.updateSuccess,
      });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.delete(
  "/:id/profile-picture",
  limiter.profilePicture,
  verifyToken,
  async (req, res, next) => {
    if (req.params.id !== req.user.id)
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message:
          "You are not authorized to update this user's profile picture.",
      });
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message:
            "The user you're trying to delete their profile picture does not exist.",
        });
      }
      const params = {
        Bucket: s3_bucketName,
        Key: `profile-picture-${req.user.id}`,
      };
      const deleteCommand = new DeleteObjectCommand(params);
      await client.send(deleteCommand);
      user.profilePicture =
        "https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png";
      await user.save();
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Profile picture deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get(
  "/:id/profile-picture",
  limiter.profilePicture,
  verifyToken,
  async (req, res, next) => {
    if (req.params.id !== req.user.id)
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message:
          "You are not authorized to access this user's profile picture.",
      });
    try {
      const user = await User.findById(req.params.id);
      if (!user || !user.profilePicture) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: "Profile picture not found.",
        });
      }

      const getObjectParams = {
        Bucket: s3_bucketName,
        Key: user.profilePicture,
      };
      const expiresIn = 3600;
      const getCommand = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(client, getCommand, { expiresIn });

      res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          profilePictureUrl: url,
          expiresAt: Date.now() + expiresIn * 1000,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.put("/:id/tasks/reorder", verifyToken, async (req, res, next) => {
  if (req.params.id !== req.user.id)
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: "You are not authorized to reorder this user's tasks.",
    });

  try {
    const { reorderedTasks } = req.body; // Expect an array of task objects with updated orders
    if (!Array.isArray(reorderedTasks)) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: responseMessages.users.toRetrieveNotFound,
      });
    }
    
    console.log(reorderedTasks);
    const reorderedTaskIds = reorderedTasks.map((task) => task.id); // List of task IDs
    // Update the `tasks` field in the User schema to reflect the new task order (using task IDs)
    user.tasks = reorderedTaskIds;
    await user.save();
    
    // Step 4: Send success response
    res.json({ success: true, data: user.tasks , message: "Tasks reordered successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
