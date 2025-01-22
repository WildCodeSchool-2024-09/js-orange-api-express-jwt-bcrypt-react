const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const MIMES_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/uploads'));
  },

  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIMES_TYPES[file.mimetype];
    callback(null, `${name}-${uuidv4()}.${extension}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5mo

const fileUpload = upload.single('file');

module.exports = fileUpload;
