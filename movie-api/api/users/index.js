import express from 'express';
import User from './userModel';
import Movie from './../movies/movieModel';
import TvShow from './../tv/tvShowModel';
import jwt from 'jsonwebtoken';

const router = express.Router() // eslint-disable-line

// Get all users
router.get('/', (req, res, next) => {
  User.find().then(users =>  res.status(200).json(users)).catch(next);
});

// Register/login a user
router.post('/', (req, res, next) => {
  console.log(req.body);
    if (!req.body.username || !req.body.password) {
      return res.status(401).json({
        success: false,
        msg: 'Please pass username and password.',
      });
    }
    if (req.query.action === 'register') {
      User.create({
        username: req.body.username,
        password: req.body.password,
      }).then(() => res.status(201).json({
        code: 201,
        msg: 'Successful created new user.',
      })).catch(next);
    } else {
      User.findByUserName(req.body.username).then(user =>{
      if (!user) return res.status(401).send({code: 401, msg: 'Authentication failed. User not found.'});
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.username, process.env.secret);
          // return the information including token as JSON
          res.status(200).json({
            success: true,
            token: 'BEARER ' + token,
          });
        } else {
          res.status(401).send({
            code: 401,
            msg: 'Authentication failed. Wrong password.'
          });
        }
      });
    }).catch(next);
  }});

// Update a user
router.put('/:userName',  (req, res, next) => {
  let userName = req.params.userName;
  if (req.body._id) delete req.body._id;
  User.findByUserName(userName)
  .then(user => {
    user.password = req.body.password;
    user.movieFavorites = req.body.movieFavorites;
    user.tvShowFavorites = req.body.tvShowFavorites;
    return user.save().then(user => res.status(200).send(user));
  }).catch(next);
});

router.get('/:userName/favorites/movies', (req, res, next) => {
  const userName = req.params.userName;
  console.log("getting fav movies for " + userName );
  User.findByUserName(userName).populate('movieFavorites').then(
      user => res.status(201).send(user.movieFavorites)
  ).catch(next);
});

router.get('/:userName/favorites/tv', (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate('tvShowFavorites').then(
      user => res.status(201).send(user.tvShowFavorites)
  ).catch(next);
});

router.put('/:userName/favorites/movies', (req, res, next) => {
  const newMovie = req.body;
  const userName = req.params.userName;

  if (newMovie && newMovie.id){
    Movie.findOneAndUpdate({id: newMovie.id}, newMovie, {new: true, upsert: true}).then(movie => {
      if (!movie) return res.status(404).send({error: "Movie not found!"});
      User.findByUserName(userName).then( user => {
        (user.movieFavorites.indexOf(movie._id) > -1) ? user : user.movieFavorites.push(movie._id.toString());
        user.save().then(user => res.status(201).send(user));
      });
    }).catch(next);
  } else {
    res.status(401).send("Unable to add favorite - data incomplete");
  }
});

router.put('/:userName/favorites/tv', (req, res, next) => {
  const newTvShow = req.body;
  const userName = req.params.userName;

  if (newTvShow && newTvShow.id){
    TvShow.findOneAndUpdate({id: newTvShow.id}, newTvShow, {new: true, upsert: true}).then(tvShow => {
      if (!tvShow) return res.status(404).send({error: "tvShow not found!"});
      User.findByUserName(userName).then( user => {
        (user.tvShowFavorites.indexOf(tvShow._id) > -1) ? user : user.tvShowFavorites.push(tvShow._id.toString());
        user.save().then(user => res.status(201).send(user));
      });
    }).catch(next);
  } else {
    res.status(401).send("Unable to add favorite - data incomplete");
  }
});

router.delete('/:userName/favorites/movies/:id', (req, res, next) => {
  const userName = req.params.userName;
  const id = req.params.id;
  Movie.findByMovieDBId(id).then(movie => {
    User.findByUserName(userName).then(user => {
      const favorite = user.movieFavorites.indexOf(movie._id);
      favorite > -1 ? user.movieFavorites.splice(favorite, 1) : user;
      user.save().then(user => res.status(200).send(user));
    }).catch(next);
  }).catch(next);
});

router.delete('/:userName/favorites/tv/:id', (req, res, next) => {
  const userName = req.params.userName;
  const id = req.params.id;
  TvShow.findByTvShowDBId(id).then(tvShow => {
    User.findByUserName(userName).then(user => {
      const favorite = user.tvShowFavorites.indexOf(tvShow._id);
      favorite > -1 ? user.tvShowFavorites.splice(favorite, 1) : user;
      user.save().then(user => res.status(200).send(user));
    }).catch(next);
  }).catch(next);
});


export default router;