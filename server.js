require('dotenv').config();

const express = require('express');
const photoRoutes = require('./routes/photos');
const https = require('https');
const fs = require('fs');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/photos/', photoRoutes);

app.get('/', (req, res) => {
  res.json({msg: 'Welcome to the app'});
});

https
  .createServer(
    {
      key: fs.readFileSync(process.env.SSL_CERT_PATH),
      cert: fs.readFileSync(process.env.SSL_CHAIN_PATH)
    },
    app
  )
  .listen(process.env.PORT, () => {
  console.log('Listening on port ' + process.env.PORT);
});