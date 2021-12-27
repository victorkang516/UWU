const Order = require('../models/Order');


const getAllUnPaidOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId, isPaid: false }).exec();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const getAllPaidOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId, isPaid: true }).exec();
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

const updateOrderQuantity = async (req, res) => {
  try {
    await Order.updateOne({ _id: req.params.orderId }, { quantity: req.body.quantity })
    res.json({message:"Order update successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const updateMultipleOrderIsPaidByUserId = async (req, res) => {
  try {
    await Order.updateMany({ isPaid: false, userId: req.params.userId }, { isPaid: true });
    //await Order.updateOne({ _id: req.params.orderId }, { quantity: req.body.quantity })
    res.json({message:"All Orders' isPaid update successfully"});
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
  getAllUnPaidOrdersByUserId,
  getAllPaidOrdersByUserId,
  getAllOrdersByShopId,
  createOrder,
  updateOrderQuantity,
  updateMultipleOrderIsPaidByUserId,
  deleteOrder
}