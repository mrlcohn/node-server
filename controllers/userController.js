const loginUser = async (req, res) => {
  res.json({message: 'Login user'});
}

const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const mongoClient = new MongoClient(process.env.CONNECTION_STRING, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

    await mongoClient.connect;
    const exists = await mongoClient
      .db('users')
      .collection('users')
      .findOne({ email: email });
    if (exists) {
      throw Error('Email already in use');
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

    res.status(200).json({ email, user });
  } catch (error) {
    res.json({ error: error.message });
  }
}

module.exports = { loginUser, signupUser };