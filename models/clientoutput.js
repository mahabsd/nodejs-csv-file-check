// const mongoose = require('mongoose');
// const Schema = mongoose.Schema

// let user = new Schema(
//     {
//         LastName: { type: String},
//         FirstName: { type: String},
//         PayId: { type: String},
//         PayId2: { type: String},
//         PayId3: { type: String},
//         PayId4: { type: String},
//         PayId5: { type: String},
//         PayId6: { type: String},
//         Mail: { type: String},
//         ManagerMail: { type: String},
//         ManagerPayId: { type: String},
//         IsAdmin: { type: String},
//         IsAccountant: { type: String},
//         Tags: { type: String},
//         LocalCountry: { type: String},
//         LocalCurrency: { type: String},
//         ReviewerMail: { type: String},
//         ReviewerPayId: { type: String},
//         DefaultProjectExternalId: { type: String},
//         IsActive: { type: String},
//         MailAlias: { type: String},
//         MileageRate: { type: String},
//         IKReference: { type: String},
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model('clientUsers', user);

const mongoose = require('mongoose');
const Schema = mongoose.Schema

let user = new Schema(
    {
        A: { type: String},
        B: { type: String},
        C: { type: String},
        D: { type: String},
        E: { type: String},
        F: { type: String},
        G: { type: String},
        H: { type: String},
        I: { type: String},
        J: { type: String},
        K: { type: String},
        L: { type: String},
        M: { type: String},
        N: { type: String},
        O: { type: String},
        P: { type: String},
        Q: { type: String},
        R: { type: String},
        S: { type: String},
        T: { type: String},
        U: { type: String},
        V: { type: String},
        W: { type: String},
    },
    { timestamps: true }
);

module.exports = mongoose.model('clientUsers', user);