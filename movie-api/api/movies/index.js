import express from 'express';
import {
  getMovies, getMovie, getMovieReviews
} from '../tmdb-api';
import Movie from './movieModel'
import wrap from 'express-async-wrapper';

const router = express.Router();

router.get('/', (req, res) => {
  getMovies().then(movies => res.status(200).send(movies));
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  let movie = getMovie(id)
  let reviews = getMovieReviews(id)

  Promise.all([movie, reviews]).then(arrayOfAllResolvedValues => {
    movie = arrayOfAllResolvedValues[0]
    reviews = arrayOfAllResolvedValues[1].results

    movie.reviews = reviews
    Movie.create(movie).then(res.status(200).send(movie))
})
});

router.get('/:id/reviews', (req, res) => {
  console.log("request made to reviews")
  const id = parseInt(req.params.id);
  let sendReviews = {}
  getMovieReviews(id).then(reviews => {
  sendReviews = reviews
  Movie.findMovieReviews(reviews.id)})
  .then(results => results ? res.status(200).send(results) : res.status(200).send(sendReviews))
});


router.post('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  Movie.findByMovieDBId(id).then(movie => {
    movie.reviews.push(req.body)
    movie.save().then(res.status(200).send(movie.reviews))});
});



export default router;