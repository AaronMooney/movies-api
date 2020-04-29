import supertest from 'supertest';
import {
  app
} from '../index.js';
import should from 'should';
import mongoose from 'mongoose';
import testData from './common';
import userModel from '../api/users/userModel';


const badToken = 'Bearer 123abc';
const testUser = {};

describe('Genres API test', function () {
  this.timeout(120000);


  before((done) => {
    testUser.username = 'user1';
    testUser.password = 'test1';
    userModel.create(testUser).then(result => done()).catch(err => done(err))
  });

  it('should get a list of Genres', (done) => {
    let token = null;
    supertest(app)
      .post('/api/users')
      .send(testUser)
      .expect(200)
      .then((res) => {
        // HTTP status should be 200
        res.should.have.property('status').equal(200);
        res.body.should.have.property('success').equal(true);
        token = res.body.token;

        supertest(app)
          .get('/api/genres/')
          .set('Authorization', token)
          .then((res) => {
            // HTTP status should be 200
            res.should.have.property('status').equal(200);
            done();
          })
      }).catch(err => done(err))
  });


  it('should prevent access to People without valid token', (done) => {
    supertest(app)
      .get('/api/genres/')
      .set('Authorization', badToken)
      .expect(401).then(res => {
        res.should.have.property('status').equal(401)
        done()
      }).catch(err => done(err))
  });

});