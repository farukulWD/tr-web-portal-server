import { NextFunction, Request, Response, Router } from 'express';

import { USER_ROLE } from './user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { userValidationSchema } from './user.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/register',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidationSchema),
  UserControllers.createUser
);

router.patch(
  '/update/:mobile',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  // (req: Request, res: Response, next: NextFunction) => {
  //   req.body = req.body.data;
  //   next();
  // },

  validateRequest(userValidationSchema),
  UserControllers.updateUser
);
router.get(
  '/get-users',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  UserControllers.getUsers
);
router.get(
  '/get-user',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.dealer, USER_ROLE.sr),
  UserControllers.getUser
);
export const UserRoutes = router;
