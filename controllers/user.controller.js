const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  responseStatusCode,
  responseStatusText,
} = require("../helper/responseHelper");
const userModel = require("../models/user.model");
const {
  userRegisterValidation,
  userLoginValidation,
} = require("../validation/user.validation");

// User register
exports.userRegister = async (req, res) => {
  try {
    const { error, value } = userRegisterValidation.validate(req.body);
    if (error) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.WARNING,
        message: error.details[0].message,
      });
    }
    const isUser = await userModel.findOne({ email: value.email });
    if (isUser) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.WARNING,
        message: "You are already registered",
      });
    }
    bcrypt.hash(value.password, 10, async (error, hash) => {
      if (error) {
        return res.status(responseStatusCode.FORBIDDEN).json({
          status: responseStatusText.WARNING,
          message: error.message,
        });
      }
      value.password = hash;
      await userModel.create(value);
      return res.status(responseStatusCode.SUCCESS).json({
        status: responseStatusText.SUCCESS,
        message: "You are successfully register",
      });
    });
  } catch (error) {
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};

// User login
exports.userLogin = async (req, res) => {
  try {
    const { error, value } = userLoginValidation.validate(req.body);
    if (error) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.WARNING,
        message: error.details[0].message,
      });
    }
    const isUser = await userModel.findOne({ email: value.email });
    if (!isUser) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: "Invalid email",
      });
    }
    const isMatch = await bcrypt.compare(value.password, isUser.password);
    if (!isMatch) {
      return res.status(responseStatusCode.FORBIDDEN).json({
        status: responseStatusText.ERROR,
        message: "Invalid password",
      });
    }
    const userToken = jwt.sign({ userId: isUser._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    return res.status(responseStatusCode.SUCCESS).json({
      status: responseStatusText.SUCCESS,
      message: "You are successfully login in",
      userToken,
    });
  } catch (error) {
    return res.status(responseStatusCode.INTERNAL_SERVER).json({
      status: responseStatusText.ERROR,
      message: error.message,
    });
  }
};
