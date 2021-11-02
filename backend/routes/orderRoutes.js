const express = require('express');
const router = express.Router();

const { getAllOrdersByUserId, createOrder, updateOrder, deleteOrder } = require('../controller/orderControllers');

//@desc GET all orders by buyer from db
//@route get /orders/:email
//@access Public
router.get('/:userId', getAllOrdersByUserId);

//@desc INSERT an order into db
//@route post /orders
//@access Public
router.post('/', createOrder);

//@desc UPDATE a order into db
//@route put /orders/:id
//@access Public
router.put('/:orderId', updateOrder);

//@desc DELETE a order in db
//@route delete /orders/:id
//@access Public
router.delete('/:orderId', deleteOrder);

module.exports = router;