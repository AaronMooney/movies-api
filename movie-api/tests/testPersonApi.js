import supertest from 'supertest';
import {
  app
} from '../index.js';
import should from 'should';
import userModel from '../api/users/userModel';
import mongoose from 'mongoose';
import testData from './common';


const badToken = 'Bearer 123abc';
const testUser = {};

describe('Person API test', function () {
  this.timeout(120000);


  before((done) => {
    testUser.username = 'user1';
    testUser.password = 'test1';
    done();
  });

  it('should get a list of People', (done) => {
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
        .get('/api/person/popular/')
        .set('Authorization', token)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          done();
        })
      }).catch(err => done(err))
  });

  it('should get a specific person', (done) => {
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
        .get(`/api/person/${testData.person.id}`)
        .set('Authorization', token)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.should.have.property('id').equal(testData.person.id);
          done();
        })
      }).catch(err => done(err))
  });

  it('should prevent access to People without valid token', (done) => {
    supertest(app)
      .get('/api/person/popular/')
      .set('Authorization', badToken)
      .expect(401).then(res => {
        res.should.have.property('status').equal(401)
        done()
      }).catch(err => done(err))
  });

  it('should get a persons credits', (done) => {
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
          .get(`/api/person/credits/${testData.person.id}/`)
          .set('Authorization', token)
          .then((res) => {
            // HTTP status should be 200
            res.should.have.property('status').equal(200);
            res.body.should.have.property('id').equal(testData.person.id);
            done()
        })
      }).catch(err => done(err))
  });

});