import express from 'express'
import User from './userModel'
import Movie from './../movies/movieModel'
import jwt from 'jsonwebtoken';

const router = express.Router() // eslint-disable-line

// Get all users
router.get('/', (req, res, next) => {
  User.find().then(users =>  res.status(200).json(users)).catch(next)
})

// Register/login a user
router.post('/', (req, res, next) => {
  console.log(req.body)
    if (!req.body.username || !req.body.password) {
      return res.status(401).json({
        success: false,
        msg: 'Please pass username and password.',
      });
    };
    if (req.query.action === 'register') {
      User.create({
        username: req.body.username,
        password: req.body.password,
      }).then(user => res.status(201).json({
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
router.put('/:id',  (req, res, next) => {
    if (req.body._id) delete req.body._id
    User.update({
      _id: req.params.id,
    }, req.body, {
      upsert: false,
    })
    .then(user => res.json(200, user)).catch(next)
})

router.get('/:userName/favorites', (req, res, next) => {
  const userName = req.params.userName;
  User.findByUserName(userName).populate('favorites').then(
      user => res.status(201).send(user.favorites)
  ).catch(next)
})

export default router