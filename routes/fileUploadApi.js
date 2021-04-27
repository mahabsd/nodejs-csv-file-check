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
const convertCsvToXlsx = require('@aternus/csv-to-xlsx');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + path.extname(file.originalname);
        cb(null, newFileName);
    }
});


const upload = multer({ storage: storage });
// Routes
router.post('/upload-single', upload.single('file'), async (req, res) => {

    lastFour = req.file.path.substr(req.file.path.length - 4);
    if (lastFour == ".csv") {

        let r = Math.random().toString(36).substring(7);
        let destination = path.join('uploads', `${r}.xlsx`);
        try {
            convertCsvToXlsx(req.file.path, destination);
            const result = excelToJson({
                sourceFile: destination
            });
            let sheet1 = Object.entries(Object.entries(result)[0])[1]
            console.log(result);
            //console.log(Object.entries(sheet1[1][0]));
            for (const [key1, value1] of Object.entries(sheet1[1][0])) {
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
                res.status(200).json({ excelJson: sheet1[1], tab3: tab3, tab4: tab4, models: models })
            });

        } catch (e) {
            console.error(e.toString());
        }
    } else {
        //from excel to json
        const result = excelToJson({
            sourceFile: req.file.path
        });

        // /////////////////////////////////////////////////
        // to check if there are more cases than the header
        // ////////////////////////////////////////////////
        var fileClean = true
        var caseProblem = []
        // for (let i = 1; i < result.Feuil1.length; i++) {
        //     // console.log("result.Feuil1[i-1].length :");
        //     // console.log(Object.keys(result.Feuil1[0]).length);
        //     // console.log("result.Feuil1[i].length");
        //     // console.log(result.Feuil1[1]);
        //     if (Object.keys(result.Feuil1[0]).length < Object.keys(result.Feuil1[i]).length) {
        //         fileClean = false
        //         caseProblem.push({
        //             errLigne1: 0,
        //             errLigne1Lenght: Object.keys(result.Feuil1[0]).length, 
        //             errLigne2: i,
        //             errLigne2Lenght: Object.keys(result.Feuil1[i]).length
        //         })
        //     }
        // }

        // console.log("my file is clean :");
        // console.log(fileClean);
        // if (caseProblem.length > 0) {
        //     console.log(caseProblem);
        // }
       
        // //////////////////////////////
        // to check empty cases in the header
        // /////////////////////////////
        // console.log("mon result : ");
        // console.log("---------------");
        // var x = 'F'
        // console.log(result.Feuil1[0]);
        // if (!result.Feuil1[0][x]) {
        //     console.log('houga houga bla bla bla');
        //     result.Feuil1[0][x] = 'EMPTY !!'
        //     console.log(result.Feuil1[0]);
        // }
        // console.log("---------------");




        //   console.log(Object.keys(result)[0]);
        let sheet1 = Object.entries(Object.entries(result)[0])[1]
        // console.log(Object.entries(sheet1[1][0]));
        for (const [key1, value1] of Object.entries(sheet1[1][0])) {
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
            
            res.status(200).json({ excelJson: sheet1[1], tab3: tab3, tab4: tab4, models: models, fileClean: fileClean, caseProblem: caseProblem})
        });
    }

    tab1 = []
    tab2 = []
    tab3 = []
    tab4 = []
});

router.post('/JSONfile', async (req, res) => {
    var jsonArr = req.body[0]
    var xlsx = json2xlsx(jsonArr);
    let r = Math.random().toString(36).substring(7);
    //delete unwanted header
    for (let i = 0; i < jsonArr.length; i++) {
        for (const [key, value] of Object.entries(jsonArr[i])) {
            if (value == "other") {
                for (let j = 0; j < jsonArr.length; j++) {
                    delete jsonArr[j][key]
                }
            }
        }
    }
    //add new users in db
    for (let i = 1; i < jsonArr.length; i++) {
        let User = new clientOutput(jsonArr[i])
        clientOutput.findOne({ A: User.A, B: User.B }).then((users, err) => {
            clientOutput.countDocuments(function (err, count) {
                if (users == null || (count == 0)) {
                    User.save()
                }
            });
        })
    }

    var xlsx = json2xlsx(Object.values(jsonArr));
    fs.writeFileSync(`uploads/${r}.xlsx`, xlsx, 'binary');
    await res.status(200).send({ message: `http://localhost:3000/uploads/${r}.xlsx` });

})

module.exports = router;

