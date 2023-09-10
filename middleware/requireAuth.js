const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({error: 'Authorization token required'});
  }

  const token = authorization.split(' ')[1];

  try {

    const _id = jwt.verify(token, process.env.SECRET);
    const projection = { _id: 1};
    
    const mongoClient = new MongoClient(process.env.CONNECTION_STRING, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

    await mongoClient.connect();
    req.user = await mongoClient.findOne({ _id }).project(projection);
    await mongoClient.close();

    next();

  } catch (error) {

    console.log(error);
    res.status(401).json({error: 'Request is not authorized'});

  }
}

module.exports = requireAuth;