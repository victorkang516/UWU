const express = require('express');
const router = express.Router();

const { getAllOrdersByBuyer, createOrder, updateOrder, deleteOrder } = require('../controller/orderControllers');

//@desc GET all orders by buyer from db
//@route get /orders/:email
//@access Public
router.get('/:email', getAllOrdersByBuyer);

//@desc INSERT an order into db
//@route post /orders
//@access Public
router.post('/', createOrder);

//@desc UPDATE a product into db
//@route put /orders/:id
//@access Public
router.put('/:id', updateOrder);

//@desc DELETE a product in db
//@route delete /orders/:id
//@access Public
router.delete('/:id', deleteOrder);

module.exports = router;