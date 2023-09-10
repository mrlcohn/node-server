require('dotenv').config();

const cors = require('cors');
const https = require('https');
const fs = require('fs');
const express = require('express');
const photoRoutes = require('./routes/photos');
const userRoutes = require('./routes/user');

const app = express();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/photos/', photoRoutes);
app.use('/api/user/', userRoutes);

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