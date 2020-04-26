import express from 'express';
import {
  getPopularPeople, getPerson, getCredits
} from '../tmdb-api';
import Person from './personModel'
import wrap from 'express-async-wrapper';

const router = express.Router();

router.get('/popular', (req, res) => {
  getPopularPeople().then(people => res.status(200).send(people));
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  let person = getPerson(id)
  let exists = Person.exists({id: id})
  let existingPerson = Person.findByPersonDBId(id)

  Promise.all([person, exists, existingPerson]).then(arrayOfAllResolvedValues => {
    person = arrayOfAllResolvedValues[0]
    exists = arrayOfAllResolvedValues[1]
    existingPerson = arrayOfAllResolvedValues[2]
    
    if (!exists){
      Person.create(person)
      res.status(200).send(person)
    } else {
      res.status(200).send(existingPerson)
    }
})
});

router.get('/credits/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  getCredits(id).then(credits => res.status(200).send(credits)) 
});

export default router;