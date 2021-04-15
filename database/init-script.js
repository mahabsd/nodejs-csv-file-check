const Model = require("../models/model");


const models = [
    { colHeader: "LastName" },
    { colHeader: "FirstName" },
    { colHeader: "PayId" },
    { colHeader: "PayId2" },
    { colHeader: "PayId3" }
]
// To Count Documents of a particular collection

Model.count(function (err, count) {
    if (count == 0) {
        Model.insertMany(models).then((modelsDB) => {
        }).catch(err => console.log(err))
    }
});
