import { NextFunction, Request, Response, Router } from 'express';
import { companyController } from './company.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';
import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middlewares/validateRequest';
import { companyValidationSchema } from './company.validation';

const router = Router();

router.post(
  '/create-company',
  upload.single('file'),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(companyValidationSchema),
  companyController.createCompanyController
);
router.get(
  '/get-companies',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  companyController.getAllCompanyController
);
