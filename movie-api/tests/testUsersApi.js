import supertest from 'supertest';
import {
    app
} from '../index.js';
import should from 'should';
import userModel from '../api/users/userModel';

const testUser = {};
const invalidUser = {};

// Tests begin
describe('Users API test', function () {
    this.timeout(120000);

    before((done) => {
      testUser.username = 'user2';
      testUser.password = 'test2';
      invalidUser.username = 'chancer1';
      invalidUser.password = 'bad1';
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
});