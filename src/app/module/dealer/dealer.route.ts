import { NextFunction, Request, Response, Router } from 'express';
import { DealerController } from './dealer.controller';
import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../users/user.constant';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/create-dealer',
  upload.fields([
    { name: 'nidPic', maxCount: 1 },
    { name: 'refNid', maxCount: 1 },
    { name: 'refPhoto', maxCount: 1 },
  ]),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  DealerController.createUserController
);

router.get("/get-dealer/:code", 
     auth(USER_ROLE.superAdmin, USER_ROLE.admin,USER_ROLE.dealer),
  DealerController.getAllDealerController)
router.get("/get-dealers", 
     auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  DealerController.getAllDealerControllers)

export const dealerRoutes = router;
