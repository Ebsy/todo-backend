import bcrypt from 'bcrypt';


import User from '../models/user.model';
// import config from '../../config/config';

const debug = require('debug')('todo-backend:userCtrl');

/**
 * Load user and append to req.
 */
function load(req, res, next, email) {
  User.get(email)
    .then((user) => {
      // debug(user);
      // debug(req);
      req.userFull = user;
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  debug(req.user);
  return res.json(req.userFull);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const salt = bcrypt.genSaltSync(10);
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt)
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const todo = req.body.todo;
  const email = req.userFull.email;

  User.update(email, todo)
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch(e => next(e));

  // const user = req.userFull;
  // user.username = req.body.username;
  // user.mobileNumber = req.body.mobileNumber;
  //
  // user.save()
  //   .then(savedUser => res.json(savedUser))
  //   .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const {
    limit = 50, skip = 0
  } = req.query;
  User.list({
    limit,
    skip
  })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default {
  load,
  get,
  create,
  update,
  list,
  remove
};
