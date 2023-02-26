const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const Chat = require("../models/chat");

exports.updatePassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const userId = req.loggedUserId;
  const password = req.body.password;

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      User.findOne({ _id: userId })
        .then((user) => {
          if (!user) {
            const error = new Error(
              "A user with this email could not be found."
            );
            error.statusCode = 401;
            throw error;
          }
          user.password = hashedPw;
          return user.save();
        })
        .then((result) => {
          res
            .status(200)
            .json({ message: "Password has been changed!", user: result });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePhone = (req, res, next) => {
  const userId = req.loggedUserId;
  const newPhoneNumber = req.body.phoneNumber;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }
      user.phone = newPhoneNumber;
      return user.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Phone number has been changed!", user: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deleteUser = (req, res, next) => {
  const userId = req.loggedUserId;

  User.findOne({ _id: userId })
    .then((result) => {
      if (!result) {
        const error = new Error("User does not exist!");
        error.statusCode = 404
        throw error;
      }
      return result.deleteOne();
    })
    .then((result) =>
      res.status(200).json({
        message: "User has been deleted.",
        result,
      })
    )
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
