const router = require('express').Router();
const { getSavedMovies, createMovieCard, deleteMovie } = require('../controllers/movies');
const { movieValidate, movieIdValidate } = require('../middlewares/requestValidation');

router.get('/', getSavedMovies);
router.post('/', movieValidate, createMovieCard);
router.delete('/:movieId', movieIdValidate, deleteMovie);

module.exports = router;