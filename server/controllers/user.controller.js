import bcrypt from 'bcrypt';
import User from '../models/user.model';

const debug = require('debug')('todo-backend:userCtrl'); // eslint-disable-line

/**
 * Create new user
 * @property {string} req.body.email - User email.
 * @property {string} req.body.password - User password.
 * @returns {User}
 */
function create(req, res, next) {
  const salt = bcrypt.genSaltSync(10);
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, salt)
  });

  user.save()
    .then(() => res.status(200)
      .json({
        message: 'User created successfully'
      }))
    .catch(e => next(e));
}

function getTodos(req, res, next) {
  User.get(req.user.email)
    .then(user => res.json(user.todos))
    .catch(e => next(e));
}

/**
 * Update user todos
 * @property {string} req.body.todo - The new todo.
 * @returns {User.todos}
 */
function updateTodos(req, res, next) {
  const todo = req.body.todo;
  const email = req.user.email;

  User.updateTodos(email, todo)
    .then((updatedUser) => {
      res.json(updatedUser.todos);
    })
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns 204 status
 */
function remove(req, res, next) {
  const email = req.user.email;
  debug(email);
  User.remove(email)
    .then(() => res.status(204)
      .send())
    .catch(e => next(e));
}

export default {
  getTodos,
  create,
  updateTodos,
  remove
};
