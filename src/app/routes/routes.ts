import { Router } from 'express';
import { UserRoutes } from '../module/users/user.route';
import { AuthRoutes } from '../module/Auth/auth.route';
import { ProductRoutes } from '../module/product/product.route';
import { OrderRoutes } from '../module/Order/order.route';
import { dealerRoutes } from '../module/dealer/dealer.route';
import { BalanceRoute } from '../module/Balance/balance.route';
import { DoRoutes } from '../module/do/do.route';
import path from 'path';
import { DeliveredRoutes } from '../module/Delivered/delivered.route';
import { NPRoutes } from '../module/NP/np.route';

const router = Router();

const moduleRoutes = [
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
    route: dealerRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
  {
    path: '/balance',
    route: BalanceRoute,
  },
  {
    path: '/do',
    route: DoRoutes,
  },
  {
    path: '/delivered',
    route: DeliveredRoutes,
  },
  {
    path:"/np",
    route: NPRoutes
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
