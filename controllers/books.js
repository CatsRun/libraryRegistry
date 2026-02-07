const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

//getAll
const getAll = async (req, res, next) => {
  const result = await mongodb.getDb().db().collection('books').find();
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
    .collection('books')
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};
// post createBook
const createBooks = async (req, res) => {
  const books = {
    book_id: req.body.book_id,
    isb: req.body.isb
  };
  const response = await mongodb.getDb().db().collection('books').insertOne(books);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the books.');
  }
};
// put updateBook
const updateBook = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const books = {
    book_id: req.body.book_id,
    isb: req.body.isb
  };
  const response = await mongodb.getDb().db().collection('books').replaceOne({ _id: userId }, books);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the books.');
  }
};
// delete deleteBook
const deleteBooks = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('books').deleteOne({ _id: userId });
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the books.');
  }
};


// module.exports = { getAll, getSingle, createBook, updateBook, deleteBook };

module.exports = { getAll};