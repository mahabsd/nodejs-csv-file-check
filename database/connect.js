const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
};

const connect = mongoose.connect('mongodb://localhost:27017/paps', options).then((success) => {
        console.log("Successfull connection to database")
    }).catch((error) => {
         console.log("=> Connect with error") 
    });

module.exports = connect;