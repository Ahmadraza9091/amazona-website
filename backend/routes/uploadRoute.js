import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import config from '../config';

// ============================================================
// Local Disk Storage
// ============================================================
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});


// ============================================================
// AWS S3 Storage (AWS SDK v3)
// ============================================================
const s3Client = new S3Client({
  region: config.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

const storageS3 = multerS3({
  s3: s3Client,
  bucket: 'amazona-bucket',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadS3 = multer({ storage: storageS3 });

router.post('/s3', uploadS3.single('image'), (req, res) => {
  res.send(req.file.location);
});

export default router;
