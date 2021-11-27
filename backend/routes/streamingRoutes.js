const express = require('express');
const router = express.Router();

const { getAllStreamings, getStreamingById, createStreaming, updateStreaming, deleteStreaming } = require('../controller/streamingControllers');

//@desc GET all streamings from db
//@route get /streamings/
//@access Public
router.get('/', getAllStreamings);

//@desc GET a streaming by streamingid from db
//@route get /streamings/:streamingId
//@access Public
router.get('/:streamingId', getStreamingById);

//@desc INSERT a streaming into db
//@route post /streamings
//@access Public
router.post('/', createStreaming);

//@desc UPDATE a streaming into db
//@route put /streamings/streamingId
//@access Public
router.put('/:streamingId', updateStreaming);

//@desc DELETE a streaming in db
//@route delete /streamings/streamingId
//@access Public
router.delete('/:streamingId', deleteStreaming);

module.exports = router;