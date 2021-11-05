const Membership = require('../models/Membership');


const getMembershipByUserId = async (req, res) => {
  try {
    const membership = await Membership.findOne({ userId: req.params.userId }).exec();
    res.json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

const createMembership = async (req, res) => {
  try {
    const membership = await Membership.create(req.body);
    res.json(membership);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: error});
  }
}

const updateMembership = async (req, res) => {
  try {
    await Membership.updateOne(
      { _id: req.params.membershipId }, 
      {
        rank: req.body.rank
      }
    )
    res.json({message:"Data update successfully"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server Error"});
  }
}

module.exports = {
  getMembershipByUserId,
  createMembership,
  updateMembership
}