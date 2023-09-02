import { getPhotos } from './db-scripts/get-random-photo'; 

const express = require('express');

const app = express();
app.use(express.json());

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

app.get("/randomPhoto", (req, res) => {
  const photo = getPhotos();
  res.status(200).send(photo);
});

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