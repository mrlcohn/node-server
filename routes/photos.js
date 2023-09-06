const express = require('express');
const {
  getAllPhotos,
  getPhoto
} = require('../controllers/photoController');
const router = express.Router();

// Get all photos
router.get("/", getAllPhotos);

// Get the S3 URL to a specific photo
app.get("/\*", getPhoto);