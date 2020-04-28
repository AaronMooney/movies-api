import supertest from 'supertest';
import {
    app
} from '../index.js';
import should from 'should';
import userModel from '../api/users/userModel';
import testData from './common'

const testUser = {};
const invalidUser = {};
const updatedUser = {};

// Tests begin
describe('Users API test', function () {
    this.timeout(120000);

    before((done) => {
      testUser.username = 'user2';
      testUser.password = 'test2';
      invalidUser.username = 'chancer1';
      invalidUser.password = 'bad1';
      updatedUser.username = testUser.username,
      updatedUser.password = "newpassword"
      userModel.create(testUser).then(result => done()).catch(err => done(err))
    });

    // test #1: Register a User
    it('should register a user', (done) => {

        const newUser = {
            username: "frankx",
            password: "apassword"
        };

        supertest(app)
            .post('/api/users')
            .send(newUser)
            .query({
                action: 'register'
            })
            .expect('Content-type', /json/)
            .expect(201) // This is the HTTP response
            .then(res => {
                // HTTP status should be 200
                res.should.have.property('status').equal(201);
                done();
            }).catch(err => done(err));
    });

    it('should return a user token for valid user', (done) => {
      supertest(app)
      .post('/api/users')
      .send(testUser)
      .expect('Content-type', /json/)
      .expect(200) // This is the HTTP response
      .then(res => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.success.should.be.true;
          res.body.token.should.exist; 
          done();
      }).catch(err => done(err));
    });

    it('should not return a token for invalid user', (done) => {

      supertest(app)
          .post('/api/users')
          .send(invalidUser)
          .expect('Content-type', /json/)
          .expect(401) // This is the HTTP response
          .then(res => {
              // HTTP status should be 401
              res.should.have.property('status').equal(401);
              should.not.exist(res.body.token);
              done();
          }).catch(err => done(err));
    });

    it('should change the password of a valid user', (done) => {

      supertest(app)
      .post('/api/users/')
      .send(testUser)
      .expect('Content-type', /json/)
      .expect(200) // This is the HTTP response
      .then(res => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.success.should.be.true;
          res.body.token.should.exist; 
          supertest(app)
          .put(`/api/users/${testUser.username}`)
          .send(updatedUser)
          .then((res) => {
            // HTTP status should be 200
            // console.log(res.body)
            res.should.have.property('status').equal(200);
            supertest(app)
            .post('/api/users/')
            .send(updatedUser)
            .expect('Content-type', /json/)
            .expect(200) // This is the HTTP response
            .then((res) => {
              res.should.have.property('status').equal(200);
              res.body.success.should.be.true;
              res.body.token.should.exist;
              done();
            })
          })
      }).catch(err => done(err));
    });

    it('should add a movie to user favorites', (done) => {

      supertest(app)
      .post('/api/users/')
      .send(updatedUser)
      .expect('Content-type', /json/)
      .expect(200) // This is the HTTP response
      .then(res => {
          // HTTP status should be 200
          res.should.have.property('status').equal(200);
          res.body.success.should.be.true;
          res.body.token.should.exist;
          supertest(app)
          .put(`/api/users/${updatedUser.username}/favorites/movies/`)
          .send(testData.movie)
          .expect('Content-type', /json/)
          .expect(201) // This is the HTTP response
          .then((res) => {
              res.should.have.property('status').equal(201);
              res.body.movieFavorites.should.not.be.empty;
              done();
            })
          }).catch(err => done(err));
      });

      it('should add a tvShow to user favorites', (done) => {

        supertest(app)
        .post('/api/users/')
        .send(updatedUser)
        .expect('Content-type', /json/)
        .expect(200) // This is the HTTP response
        .then(res => {
            // HTTP status should be 200
            res.should.have.property('status').equal(200);
            res.body.success.should.be.true;
            res.body.token.should.exist;
            supertest(app)
            .put(`/api/users/${updatedUser.username}/favorites/tv/`)
            .send(testData.tvShow)
            .expect('Content-type', /json/)
            .expect(201) // This is the HTTP response
            .then((res) => {
                res.should.have.property('status').equal(201);
                res.body.tvShowFavorites.should.not.be.empty;
                done();
              })
            }).catch(err => done(err));
        });

        it('should remove a tvShow from user favorites', (done) => {

          supertest(app)
          .post('/api/users/')
          .send(updatedUser)
          .expect('Content-type', /json/)
          .expect(200) // This is the HTTP response
          .then(res => {
              // HTTP status should be 200
              res.should.have.property('status').equal(200);
              res.body.success.should.be.true;
              res.body.token.should.exist;
              supertest(app)
              .delete(`/api/users/${updatedUser.username}/favorites/tv/${testData.tvShow.id}`)
              .send(testData.tvShow)
              .expect('Content-type', /json/)
              .expect(200) // This is the HTTP response
              .then((res) => {
                  res.should.have.property('status').equal(200);
                  res.body.tvShowFavorites.should.be.empty;
                  done();
                })
              }).catch(err => done(err));
          });

          it('should remove a movie from user favorites', (done) => {

            supertest(app)
            .post('/api/users/')
            .send(updatedUser)
            .expect('Content-type', /json/)
            .expect(200) // This is the HTTP response
            .then(res => {
                // HTTP status should be 200
                res.should.have.property('status').equal(200);
                res.body.success.should.be.true;
                res.body.token.should.exist;
                supertest(app)
                .delete(`/api/users/${updatedUser.username}/favorites/movies/${testData.movie.id}`)
                .send(testData.movie)
                .expect('Content-type', /json/)
                .expect(200) // This is the HTTP response
                .then((res) => {
                    res.should.have.property('status').equal(200);
                    res.body.movieFavorites.should.be.empty;
                    done();
                  })
                }).catch(err => done(err));
            });

});