const Streaming = require('../models/Streaming');


const getAllStreamings = async (req, res) => {
  try {
    const streamings = await Streaming.find({});
    res.json(streamings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

const getStreamingById = async (req, res) => {
  try {
    const streaming = await Streaming.findById(req.params.streamingId);
    res.json(streaming);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

const createStreaming = async (req, res) => {
  try {
    const streaming = await Streaming.create(req.body);
    res.json(streaming);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

const updateStreaming = async (req, res) => {
  try {
    await Streaming.updateOne(
      { _id: req.params.streamingId },
      {
        $set: {
          productId: req.body.productId,
          isAuctionStarted: req.body.isAuctionStarted,
          minimumBid: req.body.minimumBid,
          bidderId: req.body.bidderId,
          bidderName: req.body.bidderName,
          isAuctionEnded: req.body.isAuctionEnded
        }
      }
    )
    res.json({ message: "Data update successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}


const deleteStreaming = async (req, res) => {
  try {
    await Streaming.deleteOne({ _id: req.params.streamingId });
    res.json({ message: "Data deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getAllStreamings,
  getStreamingById,
  createStreaming,
  updateStreaming,
  deleteStreaming
}