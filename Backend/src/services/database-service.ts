import mongoose from 'mongoose';

export const connectToDatabase = (connectionString: string) => {
  mongoose.connect(connectionString)
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });
};

