import dotenv from 'dotenv'
import express from 'express'
import moviesRouter from './api/movies'
import genresRouter from './api/genres'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs'
import './db'
import usersRouter from './api/users'
import {loadUsers, removeFavorites} from './seedData'
import session from 'express-session'
import passport from './authenticate';

dotenv.config()

const app = express()
const port = process.env.PORT
const swaggerDocument = YAML.load('./../movie-api-yaml/swagger.yaml')

const errorHandler=(err,req,res,next)=>{
  res.status(500).json({status: 500, message: err});
}

if (process.env.seedDb) {
  loadUsers();
  removeFavorites();
}

// initialise passport​
app.use(passport.initialize());

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
app.use('/api/genres', genresRouter);
app.use('/api/users', usersRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});