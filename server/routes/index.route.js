import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import todoRoutes from './todo.route';

const router = express.Router(); // eslint-disable-line new-cap

/** GET root - Check service health */
router.get('/', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount todo routes at /todo
router.use('/todos', todoRoutes);

export default router;
