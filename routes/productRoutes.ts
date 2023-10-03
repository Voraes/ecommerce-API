import express from 'express';
const router = express.Router();

import { authenticateUser, authorizeUser } from '../middleware/authentication';

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
} from '../controllers/productController';

import { getSingleProductReviews } from '../controllers/reviewController';

router
  .route('/')
  .post(authenticateUser, authorizeUser('admin'), createProduct)
  .get(getAllProducts);

router.post(
  '/uploadImage',
  authenticateUser,
  authorizeUser('admin'),
  uploadImage
);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(authenticateUser, authorizeUser('admin'), updateProduct)
  .delete(authenticateUser, authorizeUser('admin'), deleteProduct);

router.get('/:id/reviews', getSingleProductReviews);

export default router;
