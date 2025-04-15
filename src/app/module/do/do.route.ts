import { Router } from 'express';
import { DoController } from './do.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();

router.post('/make-do', auth(USER_ROLE.dealer), DoController.makeDo);
router.get('/get-all-do', auth(USER_ROLE.superAdmin), DoController.getAllDo);
router.get('/get-single-do/:id', auth(USER_ROLE.superAdmin), DoController.getSingleDo);
router.post('/approved-do/:id', auth(USER_ROLE.superAdmin), DoController.approvedDo);
router.get('/get-all-undelivered-products', auth(USER_ROLE.superAdmin), DoController.getAllUndeliveredProducts);
router.get('/get-single-undelivered-products/:id', auth(USER_ROLE.superAdmin), DoController.getSingleUndeliveredProducts);
router.get('/get-undelivered-products-by-dealer/:dealerCode', auth(USER_ROLE.dealer), DoController.getUndeliveredProductsByDealer);


export const DoRoutes = router;
