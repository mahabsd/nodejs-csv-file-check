const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Model = require('../models/model')
let tab1 = []
let tab2 = []
let tab3 = []
let tab4 = []
'use strict';
const excelToJson = require('convert-excel-to-json');
let json2xlsx = require('json2xls');
let fs = require('fs');
let clientOutput = require('../models/clientoutput')


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
    for (const [key1, value1] of Object.entries(result.Feuil1[0])) {
        tab1.push(value1)
    }

    await Model.find({}, function (err, models) {
        for (let i = 0; i < models.length; i++) {
            tab2.push(models[i].colHeader)
        }
        tab1.forEach(function (element) {
            if (tab2.includes(element)) {
                tab3.push(element);
            } else {
                tab4.push(element);
            }
        });
        res.status(200).json({ excelJson: result.Feuil1, tab3: tab3, tab4: tab4, models: models })
    });
    tab1 = []
    tab2 = []
    tab3 = []
    tab4 = []
});

router.post('/JSONfile', async (req, res) => {
    var jsonArr = req.body[0]
    var xlsx = json2xlsx(jsonArr);
    let r = Math.random().toString(36).substring(7);

    for (let i = 0; i < jsonArr.length; i++) {
        for (const [key, value] of Object.entries(jsonArr[i])) {
            if (value == "other") {
                for (let j = 0; j < jsonArr.length; j++) {
                    delete jsonArr[j][key]
                }
            }
        }
    }
    var xlsx = json2xlsx(Object.values(jsonArr));
    fs.writeFileSync(`uploads/${r}.xlsx`, xlsx, 'binary');
    await res.status(200).send({ message: `http://localhost:3000/uploads/${r}.xlsx` });

})

module.exports = router;