const express = require('express');
const router = express.Router();

const { getAllProducts, getAllProductsByShopId, getProductById, createProduct, updateProduct, updateProductStock, deleteProduct } = require('../controller/productControllers');

//@desc GET all products from db
//@route get /api/products
//@access Public
router.get('/', getAllProducts);

//@desc GET a product by productId from db
//@route get /products/:id
//@access Public
router.get('/:id', getProductById);

//@desc GET all products by shopId from db
//@route get /products/seller/:shopId
//@access Public
router.get('/seller/:shopId', getAllProductsByShopId);

//@desc INSERT a product into db
//@route post /products/
//@access Public
router.post('/', createProduct);

//@desc UPDATE a product into db
//@route put /products/:id
//@access Public
router.put('/:id', updateProduct);

//@desc UPDATE a product stock into db
//@route put /products/:id
//@access Public
router.put('/updatestock/:id', updateProductStock);

//@desc DELETE a product in db
//@route delete /products/:id
//@access Public
router.delete('/:id', deleteProduct);

module.exports = router;