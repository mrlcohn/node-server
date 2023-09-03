import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import AWS from 'aws-sdk';
import express from 'express';

const app = express();
app.use(express.json());

AWS.config.update({ "region": "us-east-2" });

const PORT = 80;
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

app.get("/photos/\*", (req, res) => {
  const path = req.originalUrl.slice(7);
  const client = new S3Client({ region: 'us-east-2' });
  const command = new GetObjectCommand({ Bucket: "picture-site-photos", Key: path });

  getSignedUrl(client, command, { expiresIn: 30 })
    .then(response => res.send({ 'url': response }));
});

/*
app.post("/tshirt/:id", (req, res) => {
  const { id } = req.params;
  const { logo } = req.body;

  if (!logo) {
    res.status(418).send({ message: "We need a logo!" });
  }

  res.send({
    tshirt: `With your ${logo} and ID of ${id}`,
  });
});
*/