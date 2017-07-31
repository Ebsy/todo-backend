import mongoose from 'mongoose';

/**
 * Todo Schema
 */
const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    required: true,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * @typedef Todo
 */
export default TodoSchema; // mongoose.model('Todo', TodoSchema);
