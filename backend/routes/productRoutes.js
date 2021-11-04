const express = require('express');
const router = express.Router();

const { getAllProducts, getProductById, createProduct, updateProduct, updateProductStock, deleteProduct } = require('../controller/productControllers');

//@desc GET all products from db
//@route get /api/products
//@access Public
router.get('/', getAllProducts);

//@desc GET a products by id from db
//@route get /api/products/:id
//@access Public
router.get('/:id', getProductById);

//@desc INSERT a product into db
//@route post /api/products/
//@access Public
router.post('/', createProduct);

//@desc UPDATE a product into db
//@route put /api/products/:id
//@access Public
router.put('/:id', updateProduct);

//@desc UPDATE a product stock into db
//@route put /api/products/:id
//@access Public
router.put('/updatestock/:id', updateProductStock);

//@desc DELETE a product in db
//@route delete /api/products/:id
//@access Public
router.delete('/:id', deleteProduct);

module.exports = router;