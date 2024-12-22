import { NextFunction, Request, Response, Router } from 'express';
import { OrderController } from './order.controller';
const router = Router();


router.post("/create",OrderController.createOrder);
router.get("/get",OrderController.getOrder);
router.patch( "/active/:id",OrderController.activeOrder);


export const OrderRoutes = router;
