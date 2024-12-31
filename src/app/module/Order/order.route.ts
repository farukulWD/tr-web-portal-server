import { NextFunction, Request, Response, Router } from 'express';
import { OrderController } from './order.controller';
const router = Router();


router.post("/create",OrderController.createOrder);
router.get("/get/:id",OrderController.getOrder);
router.get("/get-draf/:idt",OrderController.getDraftOrder);
router.patch( "/active/:id",OrderController.activeOrder);
router.patch("/cancel/:id",OrderController.cancelOrder);
router.get("/get-cancel/:id" ,OrderController.getCancelOrder);
router.delete( "/delete/:id",OrderController.deleteOrder);


export const OrderRoutes = router;
