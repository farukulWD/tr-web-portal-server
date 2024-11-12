import { NextFunction, Request, Response, Router } from "express";
import { DealerController } from "./dealer.controller";
import { upload } from "../../utils/sendImageToCloudinary";
import validateRequest from "../../middlewares/validateRequest";



const router = Router();



router.post("/create-dealer", upload.array('files'),
(req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  DealerController.createUserController
)






export const dealerRoutes = router