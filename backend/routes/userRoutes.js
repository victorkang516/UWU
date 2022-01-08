const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.js');

const { readAllUsers, readUserById, readUserByEmail, createUser, updateUserById, updateUserTotalSpentById, deleteUserById } = require('../controller/userControllers');

//@desc GET all users from db
//@route get /users
//@access -
router.get('/', readAllUsers );

//@desc GET a user by Email from db
//@route get /users/:id
//@access -
router.get('/:email', readUserByEmail );

router.get('/account/:id', readUserById);

//@desc POST a user into db
//@route post /users
//@access -
router.post('/', createUser );

//@desc PUT a user by id into db
//@route put /users/:id
//@access -
router.put('/:id', upload, updateUserById );

//@desc PUT total spent by user id into db
//@route put /users/totalSpent/:id
//@access -
router.put('/totalSpent/:id', updateUserTotalSpentById );

//@desc DELETE a user by id in db
//@route delete /users/:id
//@access -
router.delete('/:id', deleteUserById );

module.exports = router;
