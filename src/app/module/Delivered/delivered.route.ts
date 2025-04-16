import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';
import { DeliveredController } from './delivered.controller';

const router = Router();


router.post('/make-delivered/:undeliveredId', auth(USER_ROLE.superAdmin), DeliveredController.deliveredDo )
router.get('/get-all-delivered', auth(USER_ROLE.superAdmin), DeliveredController.getAllDelivered)

export const DeliveredRoutes = router;
