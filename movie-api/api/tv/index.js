import express from 'express';
import {
  getTvShows, getTvShow, getTvShowReviews, getTrendingTvShows
} from '../tmdb-api';
import TvShow from './tvShowModel';

const router = express.Router();

router.get('/', (req, res) => {
  getTvShows().then(tvShows => res.status(200).send(tvShows));
});

router.get('/trending', (req, res) => {
  getTrendingTvShows().then(tvShows => res.status(200).send(tvShows));
});

router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let tvShow = getTvShow(id);
  let reviews = getTvShowReviews(id);
  let exists = TvShow.exists({id: id});
  let existingTvShow = TvShow.findByTvShowDBId(id);

  Promise.all([tvShow, reviews, exists, existingTvShow]).then(arrayOfAllResolvedValues => {
    tvShow = arrayOfAllResolvedValues[0];
    reviews = arrayOfAllResolvedValues[1].results;
    exists = arrayOfAllResolvedValues[2];
    existingTvShow = arrayOfAllResolvedValues[3];

    tvShow.reviews = reviews;

    if (!exists){
      TvShow.create(tvShow);
      res.status(200).send(tvShow);
    } else {
      res.status(200).send(existingTvShow);
    }
});
});

router.get('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  TvShow.findTvShowReviews(id)
  .then(results => results ? res.status(200).send(results) : res.status(200).send({}));
});

router.post('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  TvShow.findByTvShowDBId(id).then(tvShow => {
    tvShow.reviews.push(req.body);
    tvShow.save().then(res.status(200).send(tvShow.reviews));});
});


export default router;