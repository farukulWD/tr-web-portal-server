import express, { Application } from 'express';
import cors from 'cors';
import router from './app/routes/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import AppError from './app/errors/AppError';
import httpStatus from 'http-status';

const app: Application = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001','http://localhost:3002','https://api.tradeasiahrc.com',"api.tradeasiahrc.com","tradeasiahrc.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new AppError(httpStatus.BAD_GATEWAY, 'Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/v1', router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
