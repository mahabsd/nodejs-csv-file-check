const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const model = ['LastName', 'FirstName', 'Language', 'PayId', 'PayId2', 'PayId3', 'PayId4', 'PayId5', 'PayId6', 'Mail', 'ManagerMail', 'ManagerPayId', 'IsAdmin', 'IsAccountant', 'Tags', 'LocalCountry', 'LocalCurrency', 'ReviewerMail', 'ReviewerPayId', 'DefaultProjectExternalId', 'IsActive', 'MailAlias', 'MileageRate', 'IKReference']
let increment = 0
'use strict';
const excelToJson = require('convert-excel-to-json');

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
    if (file.mimetype == 'application/vnd.ms-excel' || file.mimetype == 'text/csv' || file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Routes
router.post('/upload-single', upload.single('file'), async (req, res) => {
    console.log(req);
    const result = excelToJson({
        sourceFile: req.file.path
    });
    console.log(result);
    for (const [key, value] of Object.entries(result.Sheet1[0])) {
        model.includes(value) ? console.log(`${key} ${value} nombre : ${increment += 1}`) : console.log(value);
    }
    res.json({ message: 'file has been uploaded successfully!', content : result.Sheet1[0] });
});

module.exports = router;