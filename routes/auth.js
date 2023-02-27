const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Lütfen geçerli bir e-posta adresi girin.")
      .custom((value, { _req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "Girdiğiniz e-mail addresi halihazırda kullanılmaktadır!"
            );
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Şifre en az 6 karakter uzunluğunda olmalıdır."),
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("İsim en az 2 karakter olmalıdır."),
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
