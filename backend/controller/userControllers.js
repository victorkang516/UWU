const User = require('../models/User');

const readAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const readUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const updateUserById = async (req, res) => {
  try {
    const users = await User.replaceOne({_id:req.params.id} ,req.body);
    res.json({message:"Updated"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const deleteUserById = async (req, res) => {
  try {
    const users = await User.deleteOne({_id:req.params.id});
    res.json({message:"Deleted"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

module.exports = {
  readAllUsers,
  readUserById,
  createUser,
  updateUserById,
  deleteUserById
}