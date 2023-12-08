const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const isURL = (value, helpers) => validator.isURL(value) ? value : helpers.message('Некорректная ссылка');

const signinValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
})

const signupValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  })
})

const userInfoValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  })
})

const movieValidate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(isURL),
    trailerLink: Joi.string().required().custom(isURL),
    thumbnail: Joi.string().required().custom(isURL),
    owner: Joi.string().hex().required().length(24),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  })
})

const movieIdValidate = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().required().length(24)
  })
})

module.exports = {
  signinValidate,
  signupValidate,
  userInfoValidate,
  movieValidate,
  movieIdValidate
}