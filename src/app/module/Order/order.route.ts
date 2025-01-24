import { NextFunction, Request, Response, Router } from 'express';
import { OrderController } from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../users/user.constant';
const router = Router();

// create order
router.post('/create', auth(USER_ROLE.dealer), OrderController.createOrder);

//  add product
router.patch(
  '/add-product-on-order',
  auth(USER_ROLE.dealer),
  OrderController.addProductOnOrder
);

// get dealer order

router.get(
  '/get-dealer-order',
  auth(USER_ROLE.dealer),
  OrderController.getDealerOrder
);


// Delete order
router.delete(
  '/delete-product-from-order',
  auth(USER_ROLE.dealer),
  OrderController.deleteProductFromOrder
);

//  get order
router.get('/get/:id', OrderController.getOrder);

// draft order
router.get('/get-draf/:idt', OrderController.getDraftOrder);

// active order
router.patch('/active/:id', OrderController.activeOrder);
// cancel order
router.patch('/cancel/:id', OrderController.cancelOrder);
// get cancel order
router.get('/get-cancel/:id', OrderController.getCancelOrder);
// delete order
router.delete('/delete/:id', OrderController.deleteOrder);

export const OrderRoutes = router;
