import mongoose from 'mongoose';
import Product from './models/productModel';
import data from './data';
import config from './config';

const seed = async () => {
  try {
    await mongoose.connect(config.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');

    await Product.deleteMany({});

    const products = data.products.map((product) => ({
      name: product.name,
      image: product.image,
      brand: product.brand,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock || 0,
      description: product.description || 'No description available',
      rating: product.rating || 0,
      numReviews: product.numReviews || 0,
    }));

    await Product.insertMany(products);

    console.log(`${products.length} products inserted successfully`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();