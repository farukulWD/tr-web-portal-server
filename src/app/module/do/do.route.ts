import { Router } from 'express';
import { DoController } from './do.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();

router.post('/make-do', auth(USER_ROLE.dealer), DoController.makeDo);
router.get('/get-all-do', auth(USER_ROLE.superAdmin), DoController.getAllDo);

export const DoRoutes = router;
