
import express from 'express';
import mongoose from 'mongoose';

import Product from '../models/productModel';
import data from '../data';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

/*
============================================================
SEED DEMO PRODUCTS
POST /api/products/seed
============================================================
*/
router.post('/seed', isAuth, isAdmin, async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = data.products.map((product) => ({
      name: product.name,
      image: product.image,
      brand: product.brand,
      price: product.price,
      category: product.category,
      countInStock: product.countInStock || 10,
      description: product.description || 'No description available',
      rating: product.rating || 4.5,
      numReviews: product.numReviews || 10,
    }));
    const createdProducts = await Product.insertMany(products);
    return res.status(201).send({
      message: `${createdProducts.length} Demo Products Seeded Successfully`,
      data: createdProducts,
    });
  } catch (error) {
    return res.status(500).send({ message: 'Error in seeding products', error: error.message });
  }
});

/*
============================================================
GET ALL PRODUCTS
/api/products
============================================================
*/
router.get('/', async (req, res) => {
  const category = req.query.category
    ? { category: req.query.category }
    : {};

  const searchKeyword = req.query.searchKeyword
    ? {
        name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
    : {};

  const sortOrder = req.query.sortOrder
    ? req.query.sortOrder === 'lowest'
      ? { price: 1 }
      : { price: -1 }
    : { _id: -1 };

  const products = await Product.find({
    ...category,
    ...searchKeyword,
  }).sort(sortOrder);

  res.send(products);
});


/*
============================================================
GET PRODUCT BY ID
/api/products/:id
============================================================
*/
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Prevent MongoDB CastError
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Invalid product ID.',
    });
  }

  const product = await Product.findById(id);

  if (product) {
    return res.send(product);
  }

  return res.status(404).send({
    message: 'Product Not Found.',
  });
});


/*
============================================================
CREATE PRODUCT REVIEW
POST /api/products/:id/reviews
============================================================
*/
router.post('/:id/reviews', isAuth, async (req, res) => {
  const { id } = req.params;

  // Prevent MongoDB CastError
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Invalid product ID.',
    });
  }

  const product = await Product.findById(id);

  if (product) {
    const review = {
      name: req.body.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;

    const updatedProduct = await product.save();

    return res.status(201).send({
      data: updatedProduct.reviews[
        updatedProduct.reviews.length - 1
      ],
      message: 'Review saved successfully.',
    });
  }

  return res.status(404).send({
    message: 'Product Not Found.',
  });
});


/*
============================================================
UPDATE PRODUCT
PUT /api/products/:id
============================================================
*/
router.put('/:id', isAuth, isAdmin, async (req, res) => {
  const { id } = req.params;

  // Prevent MongoDB CastError
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Invalid product ID.',
    });
  }

  const product = await Product.findById(id);

  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;

    const updatedProduct = await product.save();

    if (updatedProduct) {
      return res.status(200).send({
        message: 'Product Updated',
        data: updatedProduct,
      });
    }
  }

  return res.status(404).send({
    message: 'Product Not Found.',
  });
});


/*
============================================================
DELETE PRODUCT
DELETE /api/products/:id
============================================================
*/
router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  const { id } = req.params;

  // Prevent MongoDB CastError
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Invalid product ID.',
    });
  }

  const deletedProduct = await Product.findById(id);

  if (deletedProduct) {
    await deletedProduct.remove();

    return res.send({
      message: 'Product Deleted',
    });
  }

  return res.status(404).send({
    message: 'Product Not Found.',
  });
});


/*
============================================================
CREATE PRODUCT
POST /api/products
============================================================
*/
router.post('/', isAuth, isAdmin, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
  });

  const newProduct = await product.save();

  if (newProduct) {
    return res.status(201).send({
      message: 'New Product Created',
      data: newProduct,
    });
  }

  return res.status(500).send({
    message: 'Error in Creating Product.',
  });
});


export default router;


