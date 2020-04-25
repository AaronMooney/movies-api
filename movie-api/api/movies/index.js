import express from 'express';
import {
  getMovies, getMovie, getMovieReviews
} from '../tmdb-api';
import wrap from 'express-async-wrapper';

const router = express.Router();

router.get('/', (req, res) => {
  getMovies().then(movies => res.status(200).send(movies));
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovie(id).then(movie => res.status(200).send(movie));
});

router.get('/:id/reviews', (req, res, next) => {
  const id = parseInt(req.params.id);
  Movie.findMovieReviews(id)
  .then(results => res.status(200).send(results))
});

router.post('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  Movie.findByMovieDBId(id).then(movie => {
    movie.reviews.push(req.body)
    movie.save().then(res.status(200).send(movie.reviews))});
});



export default router;