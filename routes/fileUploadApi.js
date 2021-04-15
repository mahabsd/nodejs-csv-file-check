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
    tab1 = []
    tab2 = []
    tab3 = []
    tab4 = []
    //from excel to json
    const result = excelToJson({
        sourceFile: req.file.path
    });
    //console.log(result);
    let newmodel = new Model()

    for (const [key1, value1] of Object.entries(result.Feuil1[0])) {
        tab1.push(value1)
    }

   await tab1.forEach(element => {
         Model.findOne({ colHeader: element }, async function (err, docs) {
            console.log("element est : " + element);
            if (err) {
                //log error
                console.log("erreur :" + err)
            }
            else {
                if (docs != null) {
                    console.log("le model est : " + docs);
                    tab3.push(element);
                    console.log("tab3 est : " + tab3);
                } else {
                    console.log("le model est : " + docs);
                    tab4.push(element);
                    console.log("tab4 est : " + tab4);
                }
            }
        });

    })
    console.log("tab3 final : " +tab3);
     console.log("tab4 final : " +tab4);
    await res.status(200).json({ excelJson: result.Feuil1, tab3: tab3, tab4: tab4 })
});


// Model.findOne({colHeader: "LastName"}, function (err, docs) {
//     if (err){
//         console.log(err)
//     }
//     else{
//         console.log("Result : ", docs.colHeader);
//     }
// });
module.exports = router;