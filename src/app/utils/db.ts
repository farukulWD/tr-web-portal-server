import mongoose from 'mongoose';
import config from '../config';
import { logger } from '../shared/logger';



const connectDB = async () => {
    
  try {
    await mongoose.connect(config.database_url as string);
    logger.info("Connected to MongoDB successfully.");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;