import express from 'express';
import expressJwt from 'express-jwt';
import userCtrl from '../controllers/user.controller';
import config from '../../config/config';

const secret = {
  secret: config.jwtSecret
};

const router = express.Router(); // eslint-disable-line new-cap
router.route('/')
  /** GET /api/todos - Get user todos */
  .get(expressJwt(secret), userCtrl.getTodos)

  /** PATCH /api/todos - Update user todos */
  .patch(expressJwt(secret), userCtrl.updateTodos);

export default router;
