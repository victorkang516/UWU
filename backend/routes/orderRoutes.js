const express = require('express');
const router = express.Router();

const { getAllUnPaidOrdersByUserId, getAllPaidOrdersByUserId, getAllOrdersByShopId, createOrder, updateOrderQuantity, updateMultipleOrderIsPaidByUserId, deleteOrder } = require('../controller/orderControllers');

//@desc GET all orders by userId from db
//@route get /orders/:userId
//@access Public
router.get('/unpaid/:userId', getAllUnPaidOrdersByUserId);

//@desc GET all orders by userId from db
//@route get /orders/:userId
//@access Public
router.get('/paid/:userId', getAllPaidOrdersByUserId);

//@desc GET all orders by shopId from db
//@route get /orders/:shopId
//@access Public
router.get('/seller/:shopId', getAllOrdersByShopId);

//@desc INSERT an order into db
//@route post /orders
//@access Public
router.post('/', createOrder);

//@desc UPDATE a order's quantity into db
//@route put /orders/:id
//@access Public
router.put('/:orderId', updateOrderQuantity);

//@desc UPDATE many order's Paid into db
//@route put /orders/ispaid/:userId
//@access Public
router.put('/paid/:userId', updateMultipleOrderIsPaidByUserId);

//@desc DELETE a order in db
//@route delete /orders/:id
//@access Public
router.delete('/:orderId', deleteOrder);

module.exports = router;