const express = require('express');
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'file/xlsx' || file.mimetype == 'file/csv') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Routes
router.post('/upload-single', [passport.authenticate("bearer", { session: false }), upload.single('image')], async(req, res)=>{
    res.json({message: 'Image has been uploaded successfully!'});
});

router.post('/upload-multiple', [passport.authenticate("bearer", { session: false }), upload.array("images",3)], async(req, res)=>{
    res.json({message: 'Images has been uploaded successfully!'})
});

module.exports = router;