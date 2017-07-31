import request from 'supertest';
import httpStatus from 'http-status';
import chai, {
  expect
} from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('## Misc', () => {
  describe('# GET /api/', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/api/')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text)
            .to.equal('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message)
            .to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle express validation error - password is required', (done) => {
      request(app)
        .post('/api/users')
        .send({
          email: '123@email.com'
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message)
            .to.equal('"password" is required');
          done();
        })
        .catch(done);
    });
  });
});
