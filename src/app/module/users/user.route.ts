import { NextFunction, Request, Response, Router } from 'express';

import { USER_ROLE } from './user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { userValidationSchema } from './user.validation';

const router = Router();

router.post(
  '/register',
  //   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  // (req: Request, res: Response, next: NextFunction) => {
  //   // req.body = req.body;
  //   next();
  // },
  validateRequest(userValidationSchema),
  UserControllers.createUser,
);
router.patch(
  '/update/:mobile',
  //   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  // (req: Request, res: Response, next: NextFunction) => {
  //   req.body = req.body.data;
  //   next();
  // },
 
  // validateRequest(userValidationSchema),
  UserControllers.updateUser,
);
export const UserRoutes = router;
