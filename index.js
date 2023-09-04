import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import AWS from 'aws-sdk';
import cors from 'cors';
import express from 'express';
import https from 'https';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET']
}));

AWS.config.update({ "region": "us-east-2" });

const httpsServer = https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/server.cohn-family.photos/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/server.cohn-family.photos/fullchain.pem')
}, app);

const PORT = 443;
httpsServer.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

app.get("/photos/\*", (req, res) => {
  const path = req.originalUrl.slice(8);
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