const mongoose = require('mongoose');
const Schema = mongoose.Schema

let user = new Schema(
    {
        LastName: { type: String},
        FirstName: { type: String},
        PayId: { type: String},
        PayId2: { type: String},
        PayId3: { type: String},
        PayId4: { type: String},
        PayId5: { type: String},
        PayId6: { type: String},
        Mail: { type: String},
        ManagerMail: { type: String},
        ManagerPayId: { type: String},
        IsAdmin: { type: String},
        IsAccountant: { type: String},
        Tags: { type: String},
        LocalCountry: { type: String},
        LocalCurrency: { type: String},
        ReviewerMail: { type: String},
        ReviewerPayId: { type: String},
        DefaultProjectExternalId: { type: String},
        IsActive: { type: String},
        MailAlias: { type: String},
        MileageRate: { type: String},
        IKReference: { type: String},
    },
    { timestamps: true }
);

module.exports = mongoose.model('clientUsers', user);