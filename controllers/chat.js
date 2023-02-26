const { validationResult } = require("express-validator");

const Chat = require("../models/chat");

exports.sendMessage = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const userId = req.loggedUserId;
  const message = req.body.message;
  const messageTo = req.body.messageTo;
  const newMessage = { from: userId, to: messageTo, content: message };

  Chat.findOne({ members: { $all: [userId, messageTo] } })
    .then((chat) => {
      if (!chat) {
        const newChat = new Chat({
          members: [userId, messageTo],
          messages: [newMessage],
        });
        return newChat.save();
      } else {
        chat.messages = [...chat.messages, newMessage];
        return chat.save();
      }
    })
    .then((result) => {
      res.status(200).json({
        message: "Message send successfully!",
        chat: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
