import { Router } from 'express';
import { NPController } from './np.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();

router.post(
  '/create-np',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  NPController.createNp
);
router.patch(
  '/update-np/:npId',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  NPController.updateNp
);
router.get(
  '/all-np',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.dealer),
  NPController.allNp
);

export const NPRoutes = router;
