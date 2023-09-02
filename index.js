import { S3 } from '@aws-sdk/client-s3';

const express = require('express');

const app = express();
app.use(express.json());

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

app.get("/photos/*", (req, res) => {
  const path = req.originalUrl;

  var s3 = new S3();
  s3.getObject(
    { Bucket: "picture-site-photos", Key: path },
    function (error, data) {
      if (error != null) {
        res.status(404);
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.send(data.Body);
      }
    }
);

  res.status(200).send(photo);
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