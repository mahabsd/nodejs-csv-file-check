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
    for (const [key1, value1] of Object.entries(result.Feuil1[0])) {
        tab1.push(value1)
    }

    // tab1.forEach(element => {
    //     Model.findOne({ colHeader: element }).then(async function (err, docs) {
    //         console.log("element est : " + element);
    //         if (err) {
    //             //log error
    //             console.log("erreur :" + err)
    //         }
    //         else {
    //             if (docs.colHeader != undefined) {
    //                 console.log("le model est 3: " + docs);
    //                 tab3.push(element);
    //                 console.log("tab3 est : " + tab3);
    //             } else {
    //                 console.log("le model est 4: " + docs);
    //                 tab4.push(element);
    //                 console.log("tab4 est : " + tab4);
    //             }
    //         }
    //     });
    // })
    await Model.find({}, function (err, models) {
        
        tab1.forEach(function (element) {
            let i= 0
            if (models[i].colHeader == element) {
               // console.log("le model est 3: " + models);
                tab3.push(element);
              //  console.log("tab3 est : " + tab3);
            } else {
              //  console.log("le model est 4: " + models);
                tab4.push(element);
               // console.log("tab4 est : " + tab4);
            }
            i++
        });
        console.log("tab3 final : " + tab3);
        console.log("tab4 final : " + tab4);
        res.status(200).json({ excelJson: result.Feuil1, tab3: tab3, tab4: tab4 })
    });
    //  await res.status(200).json({ excelJson: result.Feuil1, tab3: tab3, tab4: tab4 })
    tab1 = []
    tab2 = []
    tab3 = []
    tab4 = []
});

module.exports = router;