const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.js');


const { getShopByUserId, getShopByShopId, createShop, updateShop, deleteShop } = require('../controller/shopControllers');

//@desc GET shop by userId from db
//@route get /shops/:shopId
//@access Public
router.get('/:userId', getShopByUserId);

//@desc GET shop by userId from db
//@route get /shops/:shopId
//@access Public
router.get('/byShopId/:shopId', getShopByShopId);

//@desc INSERT an shop into db
//@route post /shops
//@access Public
router.post('/', createShop);

//@desc UPDATE a shop by shopid into db
//@route put /shops/:shopId
//@access Public
router.put('/:shopId', upload, updateShop);

//@desc DELETE a shop by shopid in db
//@route delete /shops/:shopId
//@access Public
router.delete('/:shopId', deleteShop);

module.exports = router;