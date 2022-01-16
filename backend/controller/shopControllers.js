const Shop = require('../models/Shop');


const getShopByUserId = async (req, res) => {
  try {
    const shop = await Shop.findOne({ userId: req.params.userId }).exec();
    res.json(shop);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const getShopByShopId = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.shopId);
    res.json(shop);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const createShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.json(shop);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error});
  }
}

// const updateShop = async (req, res) => {
//   try {
//     await Shop.updateOne(
//       { _id: req.params.shopId }, 
//       { 
//         shopName: req.body.shopName, 
//         shopDescription: req.body.shopDescription, 
//         shopImageUrl: req.body.shopImageUrl,
//         shopAddress: req.body.shopAddress,
//         shopPhone: req.body.shopPhone,
//         shopEmail: req.body.shopEmail
//       }
//     )
//     res.json({message:"Data update successfully"});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({message: "Server Error"});
//   }
// }

const updateShop = async (req, res) => {
  try {
      let imgPath = '';
      const data = {
        shopName: req.body.shopName, 
        shopDescription: req.body.shopDescription, 
        shopAddress: req.body.shopAddress,
        shopPhone: req.body.shopPhone,
        shopEmail: req.body.shopEmail
      };

      console.log(req.params);

      if (req.fileValidationError) {
          res.status(400).json({message: req.fileValidationError});
      }

      if (req.file) {
          data['shopImageUrl'] = req.file.filename;
      }

      await Shop.findByIdAndUpdate({_id: req.params.shopId}, data);

      res.json({message: "Updated", img: data.imgUrl});
  } catch (error) {
      console.error(error);
      res.status(500).json({message: "Server Error"});
  }
}

const deleteShop = async (req, res) => {
  try {
    await Shop.deleteOne({ _id: req.params.shopId });
    res.json({message:"Data deleted successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

module.exports = {
  getShopByUserId,
  getShopByShopId,
  createShop,
  updateShop,
  deleteShop
}