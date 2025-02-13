import { Router } from 'express';
import { BalanceControllers } from './balance.controller';
import validateRequest from '../../middlewares/validateRequest';
import { BalanceValidationSchema } from './balance.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();

router.post(
  '/add-balance',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),

  validateRequest(BalanceValidationSchema),
  BalanceControllers.addBalanceController
);
router.get(
  '/get-balances',
  //   auth(USER_ROLE.superAdmin, USER_ROLE.admin),

  
  BalanceControllers.getBalanceController
);



export const BalanceRoute=router