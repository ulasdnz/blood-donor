const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array()[0].msg
    const error = new Error(message);
    error.statusCode = 422;
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const surname = req.body.surname;
  const password = req.body.password;
  const bloodType = req.body.bloodType;
  const location = req.body.location;
  const dateOfBirth = req.body.dateOfBirth;
  const lastDonation = req.body.lastDonation;
  const phone = req.body.phone;
  bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        email,
        password: hashedPw,
        name,
        surname,
        bloodType,
        location,
        dateOfBirth,
        lastDonation,
        phone
      });
      return user.save();
    })
    .then(result => {
      const token = jwt.sign(
        {
          email: result.email,
          userId: result._id.toString()
        },
        'somesupersecretsecret'
      );
      res.status(201).json({ message: 'Kullanıcı oluşturuldu!', token, user: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('Bu e-postaya sahip bir kullanıcı bulunamadı.');
        error.statusCode = 401;
        throw error; 
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Yanlış şifre!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'somesupersecretsecret'
      );
      res.status(200).json({ token: token, user: loadedUser });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
