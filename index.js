import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import express from 'express';

const app = express();
app.use(express.json());

const PORT = 80;
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

app.get("/photos/\*", (req, res) => {
  const path = req.originalUrl.slice(7);

  const client = new S3Client();
  const command = new GetObjectCommand({ Bucket: "picture-site-photos", Key: path });
  try {
    const url = getSignedUrl(client, command, { expiresIn: 30 });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.send({ "src": url });
  } catch {
    console.log('Error occurred, investigate');
    res.status(404).send({ "Message": "Error" });
  }

  if (error != null) {
    res.status(404);
  } else {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.send(url);
  }
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