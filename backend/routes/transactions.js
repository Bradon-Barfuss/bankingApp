const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn.js"); // This will help us connect to the database
const ObjectId = require("mongodb").ObjectId; // This helps convert the id from string to ObjectId for the _id.

//record/add
// Add a new user.
recordRoutes.route("/transaction/addTransactionInternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myobj = {
            Account: req.body.account,
            Date: req.body.date,
            Time: req.body.time,
            SendingAccount: req.body.sendingAccount,
            RecievingAccount: req.body.recievingAccount,
            AmountSent: req.body.amountSent,
        };

        const results = db_connect.collection("transactions").insertOne(myobj);
        res.json(results);
    } catch (err) {
        throw err;
    }
});

recordRoutes.route("/transaction/addTransactionExternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myobj = {
            SendingAccount: req.body.sendingAccount,
            RecievingAccount: req.body.recievingAccount,
            Date: req.body.date,
            Time: req.body.time,
            SendingAccount: req.body.sendingAccount,
            RecievingAccount: req.body.recievingAccount,
            AmountSent: req.body.amountSent,
        };
        
        const results = db_connect.collection("transactions").insertOne(myobj);
        res.json(results);
    } catch (err) {
        throw err;
    }
});




module.exports = recordRoutes;