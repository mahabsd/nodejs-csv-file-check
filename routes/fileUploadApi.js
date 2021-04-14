const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const model = ['LastName', 'FirstName', 'Language', 'PayId', 'PayId2', 'PayId3']
const Model = require('../models/model')
let increment = 0
let tab1 = []
let tab2 = []
let tab3 = []
let tab4 = []
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
    //from excel to json
    const result = excelToJson({
        sourceFile: req.file.path
    });
    //console.log(result);
    let newmodel = new Model()

    for (const [key1, value1] of Object.entries(result.Feuil1[0])) {
        tab1.push(value1)
    }
    for (const [key1, value1] of Object.entries(newmodel._doc)) {
        tab2.push(value1)
    }
    tab1.forEach(element => {
        tab2.includes(element)? tab3.push(element):tab4.push(element)
    });
    res.json({ excelJson : result.Feuil1[0], tab3 : tab3, tab4 : tab4 });
});

module.exports = router;