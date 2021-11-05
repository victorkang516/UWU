const Order = require('../models/Order');


const getAllOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).exec();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const getAllOrdersByShopId = async (req, res) => {
  try {
    const orders = await Order.find({ shopId: req.params.shopId }).exec();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const updateOrder = async (req, res) => {
  try {
    await Order.updateOne({ _id: req.params.orderId }, { quantity: req.body.quantity })
    res.json({message:"Order update successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const deleteOrder = async (req, res) => {
  try {
    await Order.deleteOne({ _id: req.params.orderId });
    res.json({message:"Order deleted successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

module.exports = {
  getAllOrdersByUserId,
  getAllOrdersByShopId,
  createOrder,
  updateOrder,
  deleteOrder
}