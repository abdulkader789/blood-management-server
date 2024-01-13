const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, registerUser, loginUser, updateUser, deleteUser } = require('../controllers/Users')

router.route('/getallusers').get(getAllUsers)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)



module.exports = router