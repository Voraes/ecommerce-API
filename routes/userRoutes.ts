import { Router } from 'express';
const router = Router();

import {
  getAllUsers,
  showCurrentUser,
  getSingleUser,
  updateUser,
  updateUserPassword,
} from '../controllers/userController';
import { authenticateUser, authorizeUser } from '../middleware/authentication';

router.get('/', authenticateUser, authorizeUser('admin'), getAllUsers);
router.get('/me', authenticateUser, showCurrentUser);
router.patch('/updateUser', authenticateUser, updateUser);
router.patch('/updateUserPassword', authenticateUser, updateUserPassword);
router.get('/:id', authenticateUser, getSingleUser);

export default router;
