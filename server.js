require('dotenv').config();

const express = require('express');
const photoRoutes = require('./routes/photos');

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

app.listen(process.env.PORT, () => {
  console.log('Listening on port ' + process.env.PORT);
});