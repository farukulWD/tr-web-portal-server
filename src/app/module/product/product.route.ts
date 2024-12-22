import { NextFunction, Request, Response, Router } from 'express';
import { ProductController } from './product.controller';

const router = Router();



router.post("/create", ProductController.createProduct);
router.get("/get-all", ProductController.getProduct);
router.patch( "/update/:id", ProductController.updateProduct);


export const ProductRoutes = router;
