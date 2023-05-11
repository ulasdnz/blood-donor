const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.updatePassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg
    const error = new Error(message);
    error.statusCode = 422;
    throw error;
  }
  const userId = req.loggedUserId;
  const oldPassword = req.body.oldPassword;
  const password = req.body.newPassword;
  let userDoc = null

  User.findOne({ _id: userId}).then(user=>{
    userDoc = user
    return bcrypt.compare(oldPassword, user.password)
  }).then(isEqual => {
    if (!isEqual) {
      const error = new Error('Mevcut şifre hatalı!');
      error.statusCode = 401;
      throw error;
    }
    bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      userDoc.password = hashedPw
      return userDoc.save()
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Şifre değiştirildi!", user: result });
    });
  })
  .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });

};

exports.updateLocation = async (req, res, next) =>{
  const userId = req.loggedUserId;
  const newLocation = req.body.newLocation;

  const user = await User.findById(userId);
  user.location = newLocation;
  try{
    const result = await user.save()
    return res
    .status(200)
    .json({ message: "Lokasyonunuz değişti!", user: result });
  }catch(err){
    err.statusCode = 500;
    next(err);
  }

}

exports.updatePhone = (req, res, next) => {
  const userId = req.loggedUserId;
  const newPhoneNumber = req.body.phoneNumber;

  User.findById(userId)
    .then((user) => {
      user.phone = newPhoneNumber;
      return user.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Telefon numaranız değişti!", user: result });
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
        const error = new Error("Böyle bir kullanıcı yok!");
        error.statusCode = 404
        throw error;
      }
      return result.deleteOne();
    })
    .then((result) =>
      res.status(200).json({
        message: "Kullanıcı silindi.",
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
