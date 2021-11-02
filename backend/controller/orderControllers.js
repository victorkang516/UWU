const Order = require('../models/Order');
const Product = require('../models/Product');


const getAllOrdersByBuyer = async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).exec();
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
    await Order.updateOne({ _id: req.params.id }, { quantity: req.body.quantity })
    res.json({message:"Data update successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const deleteOrder = async (req, res) => {
  try {
    await Order.deleteOne({ _id: req.params.id });
    res.json({message:"Data deleted successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

module.exports = {
  getAllOrdersByBuyer,
  createOrder,
  updateOrder,
  deleteOrder
}