import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import config from '../../config/config';

const secret = {
  secret: config.jwtSecret
};

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create)

  /** DELETE /api/users/:userId - Delete user */
  .delete(expressJwt(secret), userCtrl.remove);

export default router;
