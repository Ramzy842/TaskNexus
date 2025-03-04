const usersRouter = require("express").Router();
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { verifyToken } = require("../utils/middleware");
const {
  validateUsername,
  validateName,
  validateEmail,
  validatePassword,
  validateUsernameUpdate,
  validateEmailUpdate,
  validateNameUpdate,
  validatePasswordUpdate,
} = require("../utils/usersValidators");
const { getHashedPassword, createUser } = require("../utils/users");
const { responseMessages } = require("../utils/responseMessages");

usersRouter.post(
  "/",
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

usersRouter.get("/", async (req, res, next) => {
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

usersRouter.get("/:id", verifyToken, async (req, res, next) => {
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
  [
    validateUsernameUpdate,
    validateEmailUpdate,
    validateNameUpdate,
    validatePasswordUpdate,
  ],
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
        (key) =>
          key !== "username" &&
          key !== "email" &&
          key !== "name" &&
          key !== "password"
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
      let passwordHash;
      let updateData = {};
      if (Object.keys(req.body).includes("password")) {
        passwordHash = await getHashedPassword(req.body.password);
        const { password, ...body } = req.body;
        updateData = { ...body, passwordHash };
      } else updateData = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
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

usersRouter.delete("/:id", verifyToken, async (req, res, next) => {
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
});

usersRouter.put("/:id/update-password", verifyToken, async (req, res, next) => {
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
});

module.exports = usersRouter;
