const express = require('express');
const router = express.Router();

const { getAllStreamings, getStreamingById, createStreaming, updateStreaming, deleteStreaming } = require('../controller/streamingControllers');

//@desc GET all products from db
//@route get /api/products
//@access Public
router.get('/', getAllStreamings);

//@desc GET a products by id from db
//@route get /api/products/:id
//@access Public
router.get('/:id', getStreamingById);

//@desc INSERT a product into db
//@route post /api/products/
//@access Public
router.post('/', createStreaming);

//@desc UPDATE a product into db
//@route put /api/products/:id
//@access Public
router.put('/:streamingId', updateStreaming);

//@desc DELETE a product in db
//@route delete /api/products/:id
//@access Public
router.delete('/:streamingId', deleteStreaming);

module.exports = router;