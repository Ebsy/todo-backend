import request from 'supertest';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import chai, {
  expect
} from 'chai';
import app from '../../index';
import config from '../../config/config';

chai.config.includeStack = true;

describe('## Auth APIs', () => {
  const validUserCredentials = {
    email: 'neilneilneil1w1wwqwqwqweqeqe@mncxmcnxmncmxnctest.com',
    password: 'test'
  };

  const todo = {
    todo: {
      title: 'test',
      done: false
    }
  };

  let jwtToken;

  describe('## User APIs', () => {
    describe('# POST /api/users', () => {
      it('should create a new user', (done) => {
        request(app)
          .post('/api/users')
          .send(validUserCredentials)
          .expect(httpStatus.OK)
          .then((res) => {
            expect(res.body.message)
              .to.equal('User created successfully');
            // user = res.body;
            done();
          })
          .catch(done);
      });
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should get valid JWT token', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(validUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body)
            .to.have.property('token');
          jwt.verify(res.body.token, config.jwtSecret, (err, decoded) => {
            // eslint-disable-next-line no-unused-expressions
            expect(err)
              .to.not.be.ok;
            expect(decoded.email)
              .to.equal(validUserCredentials.email);
            jwtToken = `Bearer ${res.body.token}`;
            done();
          });
        })
        .catch(done);
    });

    it('should return Authentication error - wrong password', (done) => {
      request(app)
        .post('/api/auth/login')
        .send(Object.assign(validUserCredentials, {
          password: 'fail'
        }))
        .expect(httpStatus.UNAUTHORIZED)
        .then((res) => {
          expect(res.body.message)
            .to.equal('Authentication error');
          done();
        })
        .catch(done);
    });
  });

  describe('# PATCH /api/todos', () => {
    it('should update user todos', (done) => {
      request(app)
        .patch('/api/todos')
        .set('Authorization', jwtToken)
        .send(todo)
        .expect(httpStatus.OK)
        .then((res) => {
          //eslint-disable-next-line
          expect(res.body[0].title)
            .to.equal(todo.todo.title);
          done();
        })
        .catch(done);
    });
  });

  // describe('# GET /api/todos', () => {
  //   it('should get user todos', (done) => {
  //     request(app)
  //       .get('/api/auth/random-number')
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then((res) => {
  //         expect(res.body.message)
  //           .to.equal('Unauthorized');
  //         done();
  //       })
  //       .catch(done);
  //   });
  //
  //   it('should fail to get random number because of wrong token', (done) => {
  //     request(app)
  //       .get('/api/auth/random-number')
  //       .set('Authorization', 'Bearer inValidToken')
  //       .expect(httpStatus.UNAUTHORIZED)
  //       .then((res) => {
  //         expect(res.body.message)
  //           .to.equal('Unauthorized');
  //         done();
  //       })
  //       .catch(done);
  //   });
  //
  //   it('should get a random number', (done) => {
  //     request(app)
  //       .get('/api/auth/random-number')
  //       .set('Authorization', jwtToken)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.num)
  //           .to.be.a('number');
  //         done();
  //       })
  //       .catch(done);
  //   });
  // });
  describe('# DELETE /api/users', () => {
    it('should delete user', (done) => {
      request(app)
        .delete('/api/users')
        .set('Authorization', jwtToken)
        .expect(httpStatus.NO_CONTENT)
        .then(() => {
          // expect(res.body.message)
          //   .to.equal('');
          done();
        })
        .catch(done);
    });
  });
});
