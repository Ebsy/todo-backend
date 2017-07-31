import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import APIError from '../helpers/APIError';
import config from '../../config/config';

const debug = require('debug')('todo-backend:authCtrl');


/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  debug('in login!');
  User.get(req.body.email, true)
    .then((user) => {
      debug(user);
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
        return next(err);
      }

      const token = jwt.sign({
        email: user.email
      }, config.jwtSecret, {
        expiresIn: '1h'
      });
      return res.json({
        token,
        email: user.email,
        id: user._id
      });
    })
    .catch(e => next(e));
}

export default {
  login
};
