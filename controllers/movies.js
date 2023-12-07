const { CastError, ValidationError } = require('mongoose').Error;
const movieModel = require('../models/movie');
const { IncorrectError, NotFoundError, AccessError } = require('../errors/errors');
const { RESPONSE_CODE } = require('../utils/constants');

module.exports.getSavedMovies = async ( req, res, next ) => {
  try{
    const movies = await movieModel.find({ owner: req.user._id });
    return res.status(RESPONSE_CODE.OK).send(movies);
  } catch (err) {
    return next(err);
  }
}

module.exports.createMovieCard = async (req, res, next) => {
  try{
    const { country, director, duration, year, description, image, trailerLink, thumbnail, owner, movieId, nameRU, nameEN } = req.body;
    const movie = await movieModel.create({
      country, director, duration, year, description, image, trailerLink, thumbnail, owner, movieId, nameRU, nameEN
    });
    return res.status(RESPONSE_CODE.CREATED).send(movie);
  } catch(err) {
    if(err instanceof ValidationError) {
      return next(new IncorrectError('Переданы некорректные данные'))
    }
    return next(err);
  }
}

module.exports.deleteMovie = ( req, res, next ) => {
  movieModel
    .findById(req.params.movieId)
    .orFail(() => next(new NotFoundError('Фильм не найден')))
    .then((movie) => {
      if(movie.owner.toString() !== req.user._id.toString()) {
        throw new AccessError('Ошибка прав доступа');
      }
      movie.deleteOne().then(() => {
        res.status(RESPONSE_CODE.OK).send({ message: 'Фильм удален' })
      });
    })
    .catch((err) => {
      if(err instanceof CastError) {
        return next(new IncorrectError('Переданы некорректные данные'));
      }
      return next(err);
    })
}