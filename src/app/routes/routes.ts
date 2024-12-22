import { Router } from "express";
import { UserRoutes } from "../module/users/user.route";
import { AuthRoutes } from "../module/Auth/auth.route";
import { ProductRoutes } from "../module/product/product.route";
import { OrderRoutes } from "../module/Order/order.route";


const router = Router()



const moduleRoutes =[
    {
      path: '/users',
      route: UserRoutes,
    },
    {
      path: '/auth',
      route: AuthRoutes,
    },
    {
      path: '/dealer',
      route: AuthRoutes,
    },
    {
      path: '/product',
      route: ProductRoutes,
    },
    {
      path: '/order',
      route: OrderRoutes,
    },
   
  ];



  moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;