const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CastError, ValidationError } = require('mongoose').Error;
const userModel = require('../models/user');
const { IncorrectError, NotFoundError, DuplicateEmailError } = require('../errors/errors');
const { RESPONSE_CODE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  userModel.findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if(err instanceof CastError) {
        return next(new IncorrectError('Переданы некорректные данные'))
      }
      return next(err);
    })
}

module.exports.updateUserInfo = (req, res, next) => {
  const userId = req.user._id;
  const { email, name } = req.body;
  userModel.findByIdAndUpdate(
    userId,
    { email, name },
    { new: true, runValidators: true, }
  )
    .then((user) => {
      if(!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      res.status(RESPONSE_CODE.OK).send(user);
    })
    .catch((err) => {
      if(err instanceof ValidationError) {
        return next(new IncorrectError('Переданы некорректные данные'));
      }
      return next(err);
    })
}

module.exports.createUser = ( req, res, next ) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => userModel.create({
    email: req.body.email,
    password: hash,
    name: req.body.name,
  }))
  .then((user) => {
    res.status(RESPONSE_CODE.CREATED).send({
      email: user.email,
      name: user.name
    });
  })
  .catch((err) => {
    if(err.code === 11000) {
      return next(new DuplicateEmailError('Пользователь с таким Email уже зарегестрирован'))
    };
    if(err instanceof ValidationError) {
      return next(new IncorrectError('Переданы некорректные данные'))
    };
    return next(err)
  })
}

module.exports.login = ( req, res, next ) => {
  const { email, password } = req.body;

  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {expiresIn: '7d'});
      res.status(RESPONSE_CODE.OK).send({ token });
    })
    .catch((err) => {
      if(err instanceof ValidationError) {
        return next(new IncorrectError('Переданы некорретные данные'))
      }
      return next(err);
    })
}