const express = require('express');
const router = express.Router();

const {
  authenticateUser,
  authorizeUser,
} = require('../middleware/authentication');

const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImage,
} = require('../controllers/productController');

const { getSingleProductReviews } = require('../controllers/reviewController');

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

module.exports = router;
