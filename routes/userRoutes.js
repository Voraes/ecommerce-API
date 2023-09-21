const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  showCurrentUser,
  getSingleUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');
const {
  authenticateUser,
  authorizeUser,
} = require('../middleware/authentication');

router.get('/', authenticateUser, authorizeUser('admin'), getAllUsers);
router.get('/me', authenticateUser, showCurrentUser);
router.patch('/updateUser', authenticateUser, updateUser);
router.patch('/updateUserPassword', authenticateUser, updateUserPassword);
router.get('/:id', authenticateUser, getSingleUser);

module.exports = router;
