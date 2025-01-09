import { Server } from 'http';
import app from './app';
import config from './app/config';
import { errorlogger, logger } from './app/shared/logger';
import connectDB from './app/utils/db';
import { connect as connectRabbitMQ, closeRabbitMQ, handleNotifications } from './app/utils/rabbitmq';
import { initializeSocketIO } from './app/utils/socket';

async function bootstrap() {
  try {
    // Connect to the database
    await connectDB();

    // Start the server
    const server: Server = app.listen(config.port, async () => {
      logger.info(`Server running on port ${config.port}`);

      // Connect to RabbitMQ
      try {
        await connectRabbitMQ('amqp://localhost');
        logger.info('Connected to RabbitMQ');

        // Handle RabbitMQ workflows
        await handleNotifications(); // Listen for messages in the "notifications" queue
      } catch (rabbitMQError) {
        logger.error('Failed to connect to RabbitMQ:', rabbitMQError);
      }
    });

    // Graceful shutdown handlers
    const exitHandler = async () => {
      if (server) {
        server.close(() => {
          logger.info('Server closed');
        });
      }
      try {
        await closeRabbitMQ();
        logger.info('RabbitMQ connection closed');
      } catch (closeError) {
        logger.error('Error closing RabbitMQ connection:', closeError);
      }
      process.exit(1);
    };

    const unexpectedErrorHandler = async (error: unknown) => {
      errorlogger.error(error);
      await exitHandler();
    };

    process.on('uncaughtException', unexpectedErrorHandler);
    process.on('unhandledRejection', unexpectedErrorHandler);

    process.on('SIGINT', async () => {
      logger.info('SIGINT received. Closing server.');
      await exitHandler();
    });

    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received. Closing server.');
      await exitHandler();
    });

    const io = initializeSocketIO(server);


    // app.use((req, res, next) => {
    //   req.io = io;
    //   // req.redisClient = client
    //   next();
    // });

    io.on("connection", (socket) => {
      // socket.join("ball")
      console.log("user connected");
      //console.log(socket.id);

      socket.on("newnotification", (data) => {
        const { userId, notification } = data;
        if (userId) {
          io.to(`user:${userId}`).emit("newnotification", { notification });
        }
      });


      socket.on("disconnect", () => {
        console.log("user disconnected.");
      });
    });
  } catch (startupError) {
    logger.error('Failed to bootstrap the application:', startupError);
    process.exit(1);
  }
}

bootstrap();
