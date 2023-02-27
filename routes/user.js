const express = require("express");
const { body } = require("express-validator");

const userController = require("../controllers/user");
const isAuth = require("../controllers/isAuth.js");

const router = express.Router();

router.post(
  "/password",
  [
    body("password")
      .isLength({ min: 6 })
      .withMessage("Şifre en az 6 karakter uzunluğunda olmalıdır."),
  ],
  isAuth,
  userController.updatePassword
);

router.post("/phone", isAuth, userController.updatePhone);

router.delete("/", isAuth, userController.deleteUser);

module.exports = router;
