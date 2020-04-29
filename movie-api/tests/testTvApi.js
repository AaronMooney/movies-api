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

describe('TvShows API test', function () {
  this.timeout(120000);


  before((done) => {
    testUser.username = 'user1';
    testUser.password = 'test1';
    done();
  });

  it('should get a list of Tv Shows', (done) => {
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
        
        var i;
        for (i = 0; i < 2; i++) {
          switch(i){
            case(0): {
              supertest(app)
              .get('/api/tvShows/')
              .set('Authorization', token)
              .then((res) => {
                // HTTP status should be 200
                res.should.have.property('status').equal(200);
              })
            }
            case(1):{
              supertest(app)
              .get('/api/tvShows/trending/')
              .set('Authorization', token)
              .then((res) => {
                // HTTP status should be 200
                res.should.have.property('status').equal(200);
              })
            }
          }
        }
        done();
      }).catch(err => done(err))
  });

  it('should get a specific Tv Show', (done) => {
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
        .get(`/api/tvShows/${testData.tvShow.id}`)
        .set('Authorization', token)
        .then((res) => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.should.have.property('id').equal(testData.tvShow.id);
          done();
        })
      }).catch(err => done(err))
  });

  it('should prevent access to tv shows without valid token', (done) => {
    supertest(app)
      .get('/api/tvShows')
      .set('Authorization', badToken)
      .expect(401).then(res => {
        res.should.have.property('status').equal(401)
        done()
      }).catch(err => done(err))
  });

  it('should get a tv shows reviews', (done) => {
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
          .get(`/api/tvShows/${testData.tvShow.id}/`)
          .set('Authorization', token)
          .then((res) => {
            // HTTP status should be 200
            res.should.have.property('status').equal(200);
            res.body.should.have.property('id').equal(testData.tvShow.id);
            supertest(app)
              .get(`/api/tvShows/${testData.tvShow.id}/reviews/`)
              .set('Authorization', token)
              .then((res) => {
              // HTTP status should be 200
              res.should.have.property('status').equal(200);
              res.body.results[0].should.have.property('author');
              res.body.results[0].should.have.property('content');
              done()
          })
        })
      }).catch(err => done(err))
  });

  it('should add a new tv show review', (done) => {
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
          .get(`/api/tvShows/${testData.tvShow.id}/`)
          .set('Authorization', token)
          .then((res) => {
            // HTTP status should be 200
            res.should.have.property('status').equal(200);
            res.body.should.have.property('id').equal(testData.tvShow.id);
            supertest(app)
              .post(`/api/tvShows/${testData.tvShow.id}/reviews/`)
              .send(testData.review)
              .set('Authorization', token)
              .then((res) => {
              // HTTP status should be 200
              res.should.have.property('status').equal(200);
              supertest(app)
                .get(`/api/tvShows/${testData.tvShow.id}/reviews`)
                .set('Authorization', token)
                .then((res) => {
                  res.body.results[res.body.results.length -1].should.have.property('author').equal(testData.review.author);
                  res.body.results[res.body.results.length -1].should.have.property('content').equal(testData.review.content);
                  done()
                })
          })
        })
      }).catch(err => done(err))
  });

});