import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async () => {
  try {
    // Event listener for successful connection
    mongoose.connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    // Event listener for errors after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // Event listener for disconnection
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    // Event listener for reconnection
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Attempt to connect to MongoDB
    await mongoose.connect(config.databaseURL as string);

  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
