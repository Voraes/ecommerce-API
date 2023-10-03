import express from 'express';
const router = express.Router();

import { authenticateUser } from '../middleware/authentication';

import {
  createReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} from '../controllers/reviewController';

router.route('/').post(authenticateUser, createReview).get(getAllReviews);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

export default router;
