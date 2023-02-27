const express = require("express");

const chatController = require("../controllers/chat");
const isAuth = require("../controllers/isAuth.js");

const router = express.Router();

router.post("/", isAuth, chatController.sendMessage);

module.exports = router;
