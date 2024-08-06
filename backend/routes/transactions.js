const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn.js"); // This will help us connect to the database
const ObjectId = require("mongodb").ObjectId; // This helps convert the id from string to ObjectId for the _id.

//record/add
// Add a new user.

//API
//localhost:5000/transaction/addTransactionInternal/
//{   
//    "accountNumber" : 955667,
//    "SendingAccount" : "Savings",
//    "RecievingAccount" : "Checkings",
//    "AmountSent" : 30
//}
recordRoutes.route("/transaction/addTransactionInternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myobj = {
            Type: "Internal",
            accountNumber: req.body.accountNumber,
            Date: new Date().toISOString().slice(0, 10), //get the daty
            Time: new Date().toLocaleTimeString(), //get the time
            SendingAccount: req.body.SendingAccount, //i.e. checking, saving, investing
            RecievingAccount: req.body.RecievingAccount, //i.e. checking, saving, investing
            AmountSent: req.body.AmountSent,
        };

        const results = db_connect.collection("transactions").insertOne(myobj);
        res.json(results);
    } catch (err) {
        throw err;
    }
});


//API
//localhost:5000/transaction/addTransactionExternal/
//{   
//    "SendingAccountNumber" : 955667,
//    "RecievingAccountNumber" : 123456,
//    "SendingAccount" : "Investing",
//    "RecievingAccount" : "Savings",
//    "AmountSent" : 30
//}
recordRoutes.route("/transaction/addTransactionExternal").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myobj = {
            Type: "External",
            SendingAccountNumber: req.body.SendingAccountNumber,
            RecievingAccountNumber: req.body.RecievingAccountNumber,
            Date: new Date().toISOString().slice(0, 10),
            Time: new Date().toLocaleTimeString(), 
            SendingAccount: req.body.SendingAccount,
            RecievingAccount: req.body.RecievingAccount,
            AmountSent: req.body.AmountSent,
        };
        
        const results = db_connect.collection("transactions").insertOne(myobj);
        res.json(results);
    } catch (err) {
        throw err;
    }
});




module.exports = recordRoutes;