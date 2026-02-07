const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

//getAll
const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection('users').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};
// getSingle
const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection('users')
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

// post createUser
const createUsers = async (req, res) => {
  const users = {
    location_id: req.body.location_id,
    location: req.body.location,
    material_id: req.body.material_id,
    materialName: req.body.materialName
  };
  const response = await mongodb.getDb().db().collection('users').insertOne(users);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the users.');
  }
};

// put updateUser
const updateUsers = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const users = {
    location_id: req.body.location_id,
    location: req.body.location,
    material_id: req.body.material_id,
    materialName: req.body.materialNamey
  };
  const response = await mongodb.getDb().db().collection('users').replaceOne({ _id: userId }, users);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the users.');
  }
};
// delete deleteUser
const deleteUsers = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('users').deleteOne({ _id: userId });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the users.');
  }
};


// module.exports = { getAll, getSingle, createUser, updateUser, deleteUser };

module.exports = { getAll };