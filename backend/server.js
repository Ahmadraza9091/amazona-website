import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import config from './config';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';

const mongodbUrl = config.MONGODB_URL;

mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.log('MongoDB connection error:', error.reason));

const app = express();

// Built-in express JSON body parser (replaces body-parser)
app.use(express.json());

app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

app.get('/api/config/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID);
});

app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));

const server = app.listen(config.PORT, () => {
  console.log(`Server started at http://localhost:${config.PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    mongoose.connection.close();
    console.log('Server shut down gracefully.');
  });
});
