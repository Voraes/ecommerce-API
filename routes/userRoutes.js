const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  showCurrentUser,
  getSingleUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

router.get('/', getAllUsers);
router.get('/me', showCurrentUser);
router.patch('/updateUser', updateUser);
router.patch('/updateUserPassword', updateUserPassword);
router.get('/:id', getSingleUser);

module.exports = router;
