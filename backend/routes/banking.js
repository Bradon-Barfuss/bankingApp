//Useful links
//https://auth0.com/blog/how-to-implement-custom-error-responses-in-expressjs/
//https://stackoverflow.com/questions/71207726/creating-a-bank-transaction-with-express-mongo-db


const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn.js"); // This will help us connect to the database
const ObjectId = require("mongodb").ObjectId; // This helps convert the id from string to ObjectId for the _id.


// ========================================== INCREASE ACCOUNTS ====================================
//Old route: updateSavings/:email
//Update Users Savings
recordRoutes.route("/banking/increaseSavings/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        let newvalues = {
            $inc: { savings: req.body.savings } //increase users saving by the savings in reqest body
        };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues) //update the databases by new value
        console.log("Savings updated. Email: ", req.params.email, " Increase By: ", req.body.savings); //debug
        res.json(result)
    } catch (err) {
        throw err;
    }
});

//Old route name: updateChecking/:email
//Update the users checking account
recordRoutes.route("/banking/increaseChecking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let newvalues = {
            $inc: { checking: req.body.checking }
        };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        console.log("Checking updated. Email: ", req.params.email, " Increase By: ", req.body.checking); //debug
        res.json(result)
    } catch (err) {
        throw err;
    }
});

//Update the users investing account
recordRoutes.route("/banking/increaseInvesting/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let newvalues = {
            $inc: { investing: req.body.investing }
        };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        console.log("investing updated. Email: ", req.params.email, " Increase By: ", req.body.investing); //debug
        res.json(result)
    } catch (err) {
        throw err;
    }
});


//====================================================== DECREASE ACCOUNTS =================================
//Old Route name: /withdrawSavings/:email
recordRoutes.route("/banking/withdrawSavings/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        //Check if savings is above 0
        let projection = { savings: 1 }
        emailWithSavings = await db_connect.collection("banking").findOne(myquery, { projection }) //DO I NEED TO ADD A LET IN FRONT?
        if (emailWithSavings.savings - req.body.savings < 0) {
            return await res.status(400).json({ message: "Withdraw to much money" })
        }

        //Update Savings
        let newvalues = { $inc: { savings: -req.body.savings } };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        return await res.status(200).json({ message: "It Worked" })
    } catch (err) {
        throw err;
    }
});

//Old route Name /withdrawChecking/:email
recordRoutes.route("/banking/withdrawChecking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        //Check if checkings is above 0
        let projection = { checking: 1 }
        emailWithChecking = await db_connect.collection("banking").findOne(myquery, { projection })
        if (emailWithChecking.checking - req.body.checking < 0) {
            return await res.status(400).json({ message: "Withdraw to much money" })
        }

        //update Checking
        let newvalues = {
            $inc: { checking: -req.body.checking }
        };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        return await res.status(200).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

recordRoutes.route("/banking/withdrawInvesting/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };

        //Check if investing is above 0
        let projection = { investing: 1 }
        emailWithInvesting = await db_connect.collection("banking").findOne(myquery, { projection })
        if (emailWithChecking.investing - req.body.investing < 0) {
            return await res.status(400).json({ message: "Withdraw to much money" })
        }

        //update investing
        let newvalues = {
            $inc: { investing: -req.body.investing }
        };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        return await res.status(200).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

// ================================================ TRANSFERING WITHIN ACCOUNT ========================================


// === Checking to savings/investings

//Old route name /CheckingToSavings/:email
recordRoutes.route("banking/CheckingToSaving/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { checking: 1, savings: 1 }

        //Check if checking is above 0 
        emailWithChecking = await db_connect.collection("banking").findOne(myquery, { projection })
        if (emailWithChecking.checking - req.body.checking < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from checking" })
        }

        //decrease checking and increase savings
        let newvalues = {
            $inc: { checking: -req.body.checking, savings: req.body.checking }
        };

        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

recordRoutes.route("banking/CheckingToInvesting/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { checking: 1, investing: 1 }

        //Check if checking is above 0 
        emailWithChecking = await db_connect.collection("banking").findOne(myquery, { projection })
        if (emailWithChecking.checking - req.body.checking < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from checking" })
        }

        //decrease checking and increase investing
        let newvalues = {
            $inc: { checking: -req.body.checking, investing: req.body.checking }
        };

        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});


// === Savings to Checking/investing
recordRoutes.route("banking/SavingToChecking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { checking: 1, savings: 1 }

        emailWithSavings = await db_connect.collection("banking").findOne(myquery, { projection })
        if (emailWithSavings.savings - req.body.savings < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from savings" })
        }

        let newvalues = {
            $inc: { savings: -req.body.savings, checking: req.body.savings }
        };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

recordRoutes.route("banking/SavingToInvesting/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { savings: 1, investing: 1 }

        emailWithSavings = await db_connect.collection("banking").findOne(myquery, { projection })
        if (emailWithSavings.savings - req.body.savings < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from savings" })
        }

        let newvalues = {
            $inc: { savings: -req.body.savings, investing: req.body.savings }
        };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it!" })
    } catch (err) {
        throw err;
    }
});

//==== Investings To savings/checking

recordRoutes.route("banking/InvestingToChecking/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { investing: 1, checking: 1 }

        emailWithInvesting = await db_connect.collection("banking").findOne(myquery, { projection })
        if (emailWithInvesting.investing - req.body.investing < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from investing" })
        }

        let newvalues = {
            $inc: { investing: -req.body.investing, checking: req.body.investing }
        };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it! investing -> checking" })
    } catch (err) {
        throw err;
    }
});

recordRoutes.route("banking/InvestingToSavings/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { investing: 1, savings: 1 }

        emailWithInvesting = await db_connect.collection("banking").findOne(myquery, { projection })
        if (emailWithInvesting.investing - req.body.investing < 0) {
            return await res.status(400).json({ message: "Withdraw to much money from investing" })
        }

        let newvalues = {
            $inc: { investing: -req.body.investing, savings: req.body.investing }
        };
        const result = db_connect.collection("banking").updateOne(myquery, newvalues)
        return await res.status(400).json({ message: "IT did it! investing -> checking" })
    } catch (err) {
        throw err;
    }
});



module.exports = recordRoutes;