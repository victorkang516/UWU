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
        const user = await User.findOne({_id: req.params.id});
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
}

const readUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({email: req.params.email});
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
}

const createUser = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            const user1 = await User.create(req.body);
            res.json(user1);
        } else {
            res.status(400).json({message: "Email registered"});
        }
        // const user = await User.create(req.body);
        // res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error" + error});
    }
}

const updateUserById = async (req, res) => {
    try {
        let imgPath = '';
        const data = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
        };

        if (req.fileValidationError) {
            res.status(400).json({message: req.fileValidationError});
        }

        if (req.file) {
            data['imgUrl'] = req.file.filename;
        }

        await User.findByIdAndUpdate({_id: req.params.id}, data);

        res.json({message: "Updated", img: data.imgUrl});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
}

const updateUserTotalSpentById = async (req, res) => {
    try {
      await User.updateOne(
        { _id: req.params.id },
        {
          $set: { totalSpent: req.body.totalSpent }
        });
        res.json({ message: "Updated" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
}

const deleteUserById = async (req, res) => {
    try {
        const users = await User.deleteOne({_id: req.params.id});
        res.json({message: "Deleted"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server Error"});
    }
}

module.exports = {
    readAllUsers,
    readUserById,
    readUserByEmail,
    createUser,
    updateUserById,
    updateUserTotalSpentById,
    deleteUserById
}
