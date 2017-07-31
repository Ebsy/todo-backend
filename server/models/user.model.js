import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

import todo from './todo.model';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  todos: [todo],
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(email, selPass = false) {
    return this.findOne({
      email
    })
      .select(selPass ? '+password' : '-password')
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  updateTodos(email, td) {
    return this.findOneAndUpdate({
      email
    }, {
      $push: {
        todos: td
      }
    }, {
      new: true
    })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('Todo update error', httpStatus.INTERNAL_SERVER_ERROR);
        return Promise.reject(err);
      });
  },

  remove(email) {
    return this.findOneAndRemove({
      email
    })
      .exec()
      .then(() => Promise.resolve());
  },
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
