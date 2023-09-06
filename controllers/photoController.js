require('dotenv').config();

const AWS = require('aws-sdk');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const getAllPhotos = async (req, res) => {
  try {
    const mongoClient = new MongoClient(process.env.CONNECTION_STRING, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

    await mongoClient.connect();
    const data = await mongoClient
      .db('photos')
      .collection('examples')
      .find({})
      .toArray();
    await mongoClient.close();

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

const getPhoto = async (req, res) => {
  try {
    const path = req.originalUrl.slice(8);

    const mongoClient = new MongoClient(process.env.CONNECTION_STRING, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });

    await mongoClient.connect();
    const data = await mongoClient
      .db('photos')
      .collection('examples')
      .findOne({ path: path });
    await mongoClient.close();

    AWS.config.update({ region: process.env.AWS_REGION });
    const s3Client = new S3Client({ region: 'us-east-2' });
    const command = new GetObjectCommand({ Bucket: "picture-site-photos", Key: data.path });
    const url = getSignedUrl(s3Client, command, { expiresIn: 30 });
    
    res.status(200).json({ url: url });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

module.exports = {
  getAllPhotos,
  getPhoto
}