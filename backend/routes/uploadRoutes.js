import path from 'path';
import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  // On success, multer adds a `file` object to the request.
  // We send back the path to the uploaded file.
  res.send({ message: 'Image Uploaded', image: `/${req.file.path.replace(/\\/g, "/")}` });
});

export default router;
