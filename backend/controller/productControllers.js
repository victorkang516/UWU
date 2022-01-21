const Product = require('../models/Product');

// HomeScreen - Get all products available
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// ProductScreen - Get the selected product details
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// MyShopScreen - Seller need to get all his shop's products
const getAllProductsByShopId = async (req, res) => {
  try {
    const products = await Product.find({ shopId: req.params.shopId }).exec();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

const createProduct = async (req, res) => {
  try {
    
    const product = await Product.create(req.body);

    res.json(product);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

// const createProduct = async (req, res) => {
//   try {
//     let imgPath = '';
//     const data = {
//       name: req.body.name, 
//       description: req.body.description, 
//       price: req.body.price,
//       countInStock: req.body.countInStock,
//       category: req.body.category,
//       shopId: req.body.shopId,
//       shopName: req.body.shopName
//     };

//     console.log(req.params);

//     if (req.fileValidationError) {
//         res.status(400).json({message: req.fileValidationError});
//     }

//     if (req.file) {
//         data['imageUrl'] = req.file.filename;
//     }

//     await Product.create(data);

//     res.json({message: "Created", img: data.imageUrl});
// } catch (error) {
//     console.error(error);
//     res.status(500).json({message: "Server Error"});
// }
// }


// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.replaceOne({ _id: req.params.id }, req.body);

//     res.json({ message: "Data update successfully" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// }

const updateProduct = async (req, res) => {
  try {
      let imgPath = '';
      const data = {
        name: req.body.name, 
        description: req.body.description, 
        price: req.body.price,
        countInStock: req.body.countInStock,
        category: req.body.category,
        shopId: req.body.shopId,
        shopName: req.body.shopName
      };

      console.log(req.params);

      if (req.fileValidationError) {
          res.status(400).json({message: req.fileValidationError});
      }

      if (req.file) {
          data['imageUrl'] = req.file.filename;
      }

      await Product.findByIdAndUpdate({_id: req.params.id}, data);

      res.json({message: "Updated", img: data.imageUrl});
  } catch (error) {
      console.error(error);
      res.status(500).json({message: "Server Error"});
  }
}


// MyShopScreen? - If seller want to modify the current stock status
const updateProductStock = async (req, res) => {
  try {
    const product = await Product.updateOne(
      { _id: req.params.id },
      { $set: { countInStock: req.body.countInStock } }
    );
    res.json({ message: "Data update successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

const deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.id });

    res.json({ message: "Data deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getAllProductsByShopId,
  createProduct,
  updateProduct,
  updateProductStock,
  deleteProduct
}