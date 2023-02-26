const express = require("express");

const chatController = require("../controllers/chat");
const authorizationCheck =
  require("../controllers/authorizationCheck.js").authorizationCheck;

const router = express.Router();

router.post(
  "/",
  authorizationCheck,
  chatController.sendMessage
);


module.exports = router;
