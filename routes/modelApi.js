const express = require('express');
const router = express.Router();
const Model = require("../models/model");


router.get('/getModel', async (req, res) => {

    Model.find().exec().then(function (Models) {
        res.status(200).json(Models);
    }).catch(err => res.status(400).json('Error: ' + err));
});

router.put('/update/:id', (req, res) => {

    Model.findByIdAndUpdate(req.params.id, req.body).then(function (user) {
        res.status(200).json(
            { message: "updated successfully" }
        );
    }).catch(err => res.status(400).json('Error: ' + err));
});

//add new rowheader
router.post('/add/', (req, res) => {

    let rowHeader = new Model(req.body);
    rowHeader.save().then(item => {
        res.send('added successfully ');
    }).catch(err => {
        console.log(err);
    });
});

router.put('/update/:id', (req, res) => {

    Model.findByIdAndDelete(req.params.id).then(function (user) {
        res.status(200).json(
            { message: "updated successfully" }
        );
    }).catch(err => res.status(400).json('Error: ' + err));
});

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id).then(() => {
        res.status(200).json(" deleted successfully");
    }).catch(err => res.status(400).json('Error: ' + err));
})
module.exports = router;