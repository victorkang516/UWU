const express = require('express');
const router = express.Router();

const { readAllUsers, readUserById, readUserByEmail, createUser, updateUserById, deleteUserById } = require('../controller/userControllers');

//@desc GET all users from db
//@route get /api/users
//@access -
router.get('/', readAllUsers );

//@desc GET a user by Id from db
//@route get /api/users/:id
//@access -
router.get('/:email', readUserByEmail );

router.get('/account/:id', readUserById);

//@desc POST a user into db
//@route post /api/users
//@access -
router.post('/', createUser );

//@desc PUT a user by id into db
//@route put /api/users/:id
//@access -
router.put('/:id', updateUserById );

//@desc DELETE a user by id in db
//@route delete /api/users/:id
//@access -
router.delete('/:id', deleteUserById );

module.exports = router;
