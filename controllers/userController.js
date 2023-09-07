require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' });
}

const loginUser = async (req, res) => {

  const { username, password } = req.body;

  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  try {

    const mongoClient = new MongoClient(process.env.CONNECTION_STRING, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

    await mongoClient.connect();

    const user = await mongoClient
      .db('users')
      .collection('users')
      .findOne({ username });

    if (!user) {
      mongoClient.close();
      throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      mongoClient.close();
      throw Error('Incorrect password');
    }

    const token = createToken(user._id);
    res.status(200).json({ username, token });

  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password) {
    throw Error('All fields must be filled');
  }

  if (!validator.isEmail(email)) {
    throw Error('Email is not valid');
  }

  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough');
  }

  try {
    const mongoClient = new MongoClient(process.env.CONNECTION_STRING, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

    await mongoClient.connect();
    const exists = await mongoClient
      .db('users')
      .collection('users')
      .findOne({ $or: [{ username: username }, { email: email }]});
    if (exists) {

      mongoClient.close();
      throw Error('Email or username already in use');

    }

    const salt = await bcrypt.getSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await mongoClient
      .db('users')
      .collection('users')
      .insertOne({
        username,
        email,
        password: hash
    });

    await mongoClient.close();

    const token = createToken(user.insertedId);
    res.status(200).json({ username, token });

  } catch (error) {
    res.json({ error: error.message });
  }
}

module.exports = { loginUser, signupUser };