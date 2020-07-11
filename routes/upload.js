const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const router = require('express').Router();

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY_ID,
  AWS_BUCKET
} = process.env;

const s3 = new aws.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY_ID,
  bucket: AWS_BUCKET
})

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: AWS_BUCKET,
    metadata: function (req, file, cb) {
      cb(null, {});
    },
    key: function (req, file, cb) {
      console.log(file);
      const extension = file.mimetype.split('/')[1];
      cb(null, file.originalname + Date.now().toString() + "." + extension)
    }
  })
})

router.post('/', upload.single('file'), function(req, res, next) {
  res.location(req.file.location);
  res.json(req.file)
});

module.exports = router;
