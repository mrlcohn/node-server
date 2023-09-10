const express = require('express');
const {
  getAllPhotos,
  addPhoto,
  getPhoto
} = require('../controllers/photoController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

// Get all photos
router.get("/", getAllPhotos);

// Add a photo
router.post("/add/", addPhoto);

// Get the S3 URL to a specific photo
router.get("/\*", getPhoto);

module.exports = router;