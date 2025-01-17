import { NextFunction, Request, Response, Router } from 'express';
import { ProductController } from './product.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';

const router = Router();

router.post(
  '/create',

  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.dealer, USER_ROLE.sr),
  ProductController.createProduct
);
router.get(
  '/get-all',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.dealer, USER_ROLE.sr),
  ProductController.getProduct
);
router.get(
  '/get-single/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.dealer, USER_ROLE.sr),
  ProductController.getSingleProduct
);
router.patch(
  '/update/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.dealer, USER_ROLE.sr),
  ProductController.updateProduct
);
router.delete(
  '/delete/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.dealer, USER_ROLE.sr),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
