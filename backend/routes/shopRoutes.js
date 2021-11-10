const express = require('express');
const router = express.Router();

const { getShopByUserId, createShop, updateShop, deleteShop } = require('../controller/shopControllers');

//@desc GET shop by userId from db
//@route get /shops/:userid
//@access Public
router.get('/:userId', getShopByUserId);

//@desc INSERT an shop into db
//@route post /shops
//@access Public
router.post('/', createShop);

//@desc UPDATE a shop by shopid into db
//@route put /shops/:id
//@access Public
router.put('/:shopId', updateShop);

//@desc DELETE a shop by shopid in db
//@route delete /shops/:id
//@access Public
router.delete('/:shopid', deleteShop);

module.exports = router;