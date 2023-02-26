const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/user");
const authorizationCheck =
  require("../controllers/authorizationCheck.js").authorizationCheck;

const router = express.Router();

router.post(
  "/password",
  [body("password").trim().isLength({ min: 6 })],
  authorizationCheck,
  userController.updatePassword
);

router.post("/phone",authorizationCheck, userController.updatePhone)

router.delete("/", authorizationCheck, userController.deleteUser);

module.exports = router;
