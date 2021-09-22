const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const updateProduct = async (req, res) => {
  try {
    const product = await Product.replaceOne({_id:req.params.id} ,req.body);

    res.json({message:"Data update successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({_id:req.params.id});

    res.json({message:"Data deleted successfully"});

  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}