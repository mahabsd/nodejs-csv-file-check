const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Model = require('../models/model');
const translatte = require('translatte');
const parse = require('csv-parse/lib/sync')
var tab1 = []
var tab2 = []
var tab3 = []
var tab4 = []
var tab5 = []
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
        
        //  const absolutePath = path.join("../uploads", req.file.path);
        // const jsonString = fs.readFileSync(req.file.path, "utf-8");
        // const records = parse(jsonString, {
        //   delimiter: [";",","],
        //   trim: true
        // })
        //   //console.log(records);
        //   recordsString = records.toString()
          let r = Math.random().toString(36).substring(7);
          let destination = path.join('uploads', `${r}.xlsx`);
        try {
            convertCsvToXlsx(req.file.path, destination);
            const result = excelToJson({
                sourceFile: destination
            });
            let sheet1 = Object.entries(Object.entries(result)[0])[1]

            var x = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            for (let j = 0; j < x.length; j++) {
                for (let i = 1; i < sheet1.length; i++) {
                    if (!sheet1[1][0][x[j]] && sheet1[1][i][x[j]]) {
                        sheet1[1][0][x[j]] = 'CASE ' + (j + 1)
                        i = sheet1.length
                    }
                }
            }

            for (const [key1, value1] of Object.entries(sheet1[1][0])) {
                tab1.push(value1)
            }
            await Model.find({}, async (err, models)=> {
                for (let i = 0; i < models.length; i++) {
                    tab2.push(models[i].colHeader)
                }
                tab1.forEach(async (element)=> {
                    if (tab2.includes(element)) {
                        tab3.push(element);
                    } else {
                        tab4.push(element);
                        try{

                            const res = await translatte(element, { from: 'fr', to: 'en' });
                            console.log('heyyyyyy');
                            tab5.push({word:element, tanslated : res.text})
                            console.log(tab5);
                            console.log(tab4);
    
                        }catch(error)
                        {
                            console.error(err);
                        }
                    }
                });
                // for (let index = 0; index < tab4.length; index++) {
                   
                //     tab5 = []
                //     try{

                //         const res = await translatte(tab4[index], { from: 'fr', to: 'en' });
                //         console.log('heyyyyyy');
                //         tab5.push({word:tab4[index], tanslated : res.text})
                //         console.log(tab5);
                //         console.log(tab4);

                //     }catch(error)
                //     {
                //         console.error(err);
                //     }
                // }
                tab04 = tab4
                tab03 = tab3
                setTimeout(function () {
                    res.status(200).json({ excelJson: sheet1[1], tab3: tab03, tab4: tab04, models: models, tab5: tab5 })
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
        var x = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let sheet1 = Object.entries(Object.entries(result)[0])[1]
        for (let j = 0; j < x.length; j++) {
            for (let i = 1; i < sheet1.length; i++) {
                if (!sheet1[1][0][x[j]] && sheet1[1][i][x[j]]) {
                    sheet1[1][0][x[j]] = 'CASE ' + (j + 1)
                    i = sheet1.length
                }
            }
        }

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
            for (let index = 0; index < tab4.length; index++) {
                tab5 = []
                translatte(tab4[index], { from: 'fr', to: 'en' }).then(res => {
console.log('heyyyyyy');
                    tab5.push({word:tab4[index], tanslated : res.text})
                    console.log(tab5);
                }).catch(err => {
                    console.error(err);
                });
            }
            tab04 = tab4
            tab03 = tab3
            setTimeout(function () {
                res.status(200).json({ excelJson: sheet1[1], tab3: tab03, tab4: tab04, models: models, tab5: tab5 })
            }, 5000);
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
        Object.keys(jsonArr[i]).forEach(key => {
            Object.keys(user).forEach(key1 => {
                if (key1 == jsonArr[0][key]) {
                    user[key1] = jsonArr[i][key]
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
    var xlsx = json2xlsx(Object.values(jsonArr));
    fs.writeFileSync(`uploads/${r}.xlsx`, xlsx, 'binary');
    await res.status(200).send({ message: `http://localhost:3000/uploads/${r}.xlsx` });

})
router.get("/getAllUsers", (req, res) => {
    clientOutput.find().exec().then(function (users) {
        res.status(200).json(users);
    }).catch(err => res.status(400).json('Error: ' + err));
})
module.exports = router;
