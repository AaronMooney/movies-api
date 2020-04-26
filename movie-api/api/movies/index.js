import express from 'express';
import {
  getMovies, getMovie, getMovieReviews, getTrendingMovies, getUpcomingMovies
} from '../tmdb-api';
import Movie from './movieModel'
import wrap from 'express-async-wrapper';

const router = express.Router();

router.get('/', (req, res) => {
  getMovies().then(movies => res.status(200).send(movies));
});

router.get('/trending', (req, res) => {
  getTrendingMovies().then(movies => res.status(200).send(movies));
})

router.get('/upcoming', (req, res) => {
  getUpcomingMovies().then(movies => res.status(200).send(movies));
})

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  let movie = getMovie(id)
  let reviews = getMovieReviews(id)
  let exists = Movie.exists({id: id})
  let existingMovie = Movie.findByMovieDBId(id)

  Promise.all([movie, reviews, exists, existingMovie]).then(arrayOfAllResolvedValues => {
    movie = arrayOfAllResolvedValues[0]
    reviews = arrayOfAllResolvedValues[1].results
    exists = arrayOfAllResolvedValues[2]
    existingMovie = arrayOfAllResolvedValues[3]

    movie.reviews = reviews
    
    if (!exists){
      Movie.create(movie)
      res.status(200).send(movie)
    } else {
      res.status(200).send(existingMovie)
    }
})
});

router.get('/:id/reviews', (req, res) => {
  console.log("request made to reviews")
  const id = parseInt(req.params.id);
  Movie.findMovieReviews(id)
  .then(results => results ? res.status(200).send(results) : res.status(200).send({}))
});


router.post('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  Movie.findByMovieDBId(id).then(movie => {
    movie.reviews.push(req.body)
    movie.save().then(res.status(200).send(movie.reviews))});
});


export default router;