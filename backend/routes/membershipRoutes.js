const express = require('express');
const router = express.Router();

const { getMembershipByUserId, createMembership, updateMembership } = require('../controller/membershipControllers');

//@desc GET shop by userId from db
//@route get /shops/:userid
//@access Public
router.get('/:userId', getMembershipByUserId);

//@desc INSERT an shop into db
//@route post /shops
//@access Public
router.post('/', createMembership);

//@desc UPDATE a shop by shopid into db
//@route put /shops/:id
//@access Public
router.put('/:membershipId', updateMembership);

module.exports = router;