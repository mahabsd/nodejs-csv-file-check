const Model = require("../models/model");
const User = require("../models/user");
const bcrypt = require('bcryptjs');


const models = [
    { colHeader: "LastName" },
    { colHeader: "FirstName" },
    { colHeader: "PayId" },
    { colHeader: "PayId2" },
    { colHeader: "PayId3" }
]
const users = [
    {email: "mehdi@gmail.com", password: bcrypt.hashSync("mehdi")},
    {email: "maha@gmail.com", password:bcrypt.hashSync("maha")},
    {email: "sofien@gmail.com", password:bcrypt.hashSync("sofien")},
]
// To Count Documents of a particular collection

Model.count(function (err, count) {
    if (count == 0) {
        Model.insertMany(models).then((modelsDB) => {
        }).catch(err => console.log(err))
    }
});


User.count(function (err, count) {
    if (count == 0) {
        User.insertMany(users).then((modelsDB) => {
        }).catch(err => console.log(err))
    }
});