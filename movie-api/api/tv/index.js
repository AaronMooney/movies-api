import express from 'express';
import {
  getTvShows, getTvShow, getTvShowReviews
} from '../tmdb-api';
import wrap from 'express-async-wrapper';

const router = express.Router();

router.get('/', (req, res) => {
  console.log("a")
  getTvShows().then(tvShows => res.status(200).send(tvShows));
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  getTvShow(id).then(tvShow => res.status(200).send(tvShow));
});

router.get('/:id/reviews', (req, res, next) => {
  const id = parseInt(req.params.id);
  TvShow.findTvShowReviews(id)
  .then(results => res.status(200).send(results))
});

router.post('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  TvShow.findByTvShowDBId(id).then(tvShow => {
    tvShow.reviews.push(req.body)
    tvShow.save().then(res.status(200).send(tvShow.reviews))});
});


export default router;