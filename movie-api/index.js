import dotenv from 'dotenv';
import express from 'express';
import moviesRouter from './api/movies';
import genresRouter from './api/genres';
import tvShowsRouter from './api/tv';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import './db';
import usersRouter from './api/users';
import session from 'express-session';
import passport from './authenticate';
import cors from 'cors';
import personRouter from './api/person';

dotenv.config();

export const app = express(); 
const port = process.env.PORT;
const swaggerDocument = YAML.load('./../movie-api-yaml/swagger.yaml');

const errorHandler=(err,req,res)=>{
  res.status(500).json({status: 500, message: err});
};

//initialize passport
app.use(passport.initialize());
app.use(cors());

//session middleware
app.use(session({
  secret: 'ilikecake',
  resave: true,
  saveUninitialized: true
}));


//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));

app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/tvShows', passport.authenticate('jwt', {session: false}), tvShowsRouter);
app.use('/api/person', passport.authenticate('jwt', {session: false}), personRouter);
app.use('/api/genres', passport.authenticate('jwt', {session: false}), genresRouter);
app.use('/api/users', usersRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});