import express from 'express';
const router = express.Router();

import { authenticateUser, authorizeUser } from '../middleware/authentication';

import {
  createOrder,
  getAllOrders,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} from '../controllers/orderController';

router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizeUser('admin'), getAllOrders);

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders);

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

export default router;
