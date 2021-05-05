const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Model = require('../models/model');
const translatte = require('translatte');
const controllersApi = require("./controllersApi")
var excelHeader = []
var modelArray = []
var translatedHeader = []
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
        //generate random file name
        let randomName = controllersApi.randomFileName()
        let destination = path.join('uploads', `${randomName}.xlsx`);

        try {
            convertCsvToXlsx(req.file.path, destination);
            const result = excelToJson({
                sourceFile: destination
            });
            let sheet1 = Object.entries(Object.entries(result)[0])[1]
            //empty case check
            sheet1 = controllersApi.emptyCaseCheck(sheet1)
            for (const [key1, value1] of Object.entries(sheet1[1][0])) {
                excelHeader.push(value1)
            }
            await Model.find({}, async (err, modelArrays) => {
                for (let i = 0; i < modelArrays.length; i++) {
                    modelArray.push(modelArrays[i].colHeader)
                }
                //model-excel file comparison and translation
                let mapTransResult = controllersApi.modelExcelCompare(excelHeader, modelArray)
                console.log(Object.entries(mapTransResult)[1][1]);
                Object.entries(mapTransResult)[1][1].forEach(async(element) => {
                    const res = await translatte(element, { from: 'fr', to: 'en' });
                    //translatedHeader.push({word:element, tanslated : res.text})
                    translatedHeader.push(res.text)
                })
                setTimeout(function () {
                    res.status(200).json({ excelJson: sheet1[1], found: Object.entries(mapTransResult)[0][1], notFound: Object.entries(mapTransResult)[1][1], models: modelArray, translatedHeader: translatedHeader })
                }, 5000);
            });

        } catch (e) {
            console.error(e.toString());
        }
    } else {
        //from excel to json
        const result = excelToJson({
            sourceFile: req.file.path
        });
        let sheet1 = Object.entries(Object.entries(result)[0])[1]
        sheet1 = controllersApi.emptyCaseCheck(sheet1)

        for (const [key1, value1] of Object.entries(sheet1[1][0])) {
            excelHeader.push(value1)
        }
        await Model.find({}, function (err, modelArrays) {
            for (let i = 0; i < modelArrays.length; i++) {
                modelArray.push(modelArrays[i].colHeader)
            }
            //model-excel file comparison and translation
            let mapTransResult = controllersApi.modelExcelCompare(excelHeader, modelArray)
            Object.entries(mapTransResult)[1][1].forEach(async(element) => {
                const res = await translatte(element, { from: 'fr', to: 'en' });
                //translatedHeader.push({word:element, tanslated : res.text})
                translatedHeader.push(res.text)
            })
            setTimeout(function () {
                res.status(200).json({ excelJson: sheet1[1], found: Object.entries(mapTransResult)[0][1], notFound: Object.entries(mapTransResult)[1][1], modelArray: modelArray, translatedHeader: translatedHeader })
            }, 5000);
        });
    }
});

router.post('/JSONfile', async (req, res) => {
    var jsonArr = req.body[0]
    let randomxlsxName =  controllersApi.randomFileName()
    //delete unwanted header in excel sheet
   let jsonArray = controllersApi.deleteUnwantedHeader(jsonArr)
    //add new users in db
    for (let i = 1; i < jsonArray.length; i++) {
        let user = {
            LastName: "",
            FirstName: "",
            PayId: "",
            PayId2: "",
            PayId3: "",
            PayId4: "",
            PayId5: "",
            PayId6: "",
            Mail: "",
            ManagerMail: "",
            ManagerPayId: "",
            IsAdmin: "",
            IsAccountant: "",
            Tags: "",
            LocalCountry: "",
            LocalCurrency: "",
            ReviewerMail: "",
            ReviewerPayId: "",
            DefaultProjectExternalId: "",
            IsActive: "",
            MailAlias: "",
            MileageRate: "",
            IKReference: "",
        }
        Object.keys(jsonArray[i]).forEach(key => {
            Object.keys(user).forEach(key1 => {
                if (key1 == jsonArray[0][key]) {
                    user[key1] = jsonArray[i][key]
                }
            })
        })
        let User = new clientOutput(user)
        clientOutput.findOne({
            LastName: User.LastName, FirstName: User.FirstName,
            Mail: User.Mail, MailAlias: User.MailAlias
        }).then((users, err) => {
            clientOutput.countDocuments(function (err, count) {
                if (users == null || (count == 0)) {
                    User.save()
                }
            });
        })
    }
    var xlsx = json2xlsx(Object.values(jsonArray));
    fs.writeFileSync(`uploads/${randomxlsxName}.xlsx`, xlsx, 'binary');
    await res.status(200).send({ message: `http://localhost:3000/uploads/${randomxlsxName}.xlsx` });

})
router.get("/getAllUsers", (req, res) => {
    clientOutput.find().exec().then(function (users) {
        res.status(200).json(users);
    }).catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router;
