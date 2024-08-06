//usesful links
//https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/read-operations/project/

const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn.js"); // This will help us connect to the database
const ObjectId = require("mongodb").ObjectId; // This helps convert the id from string to ObjectId for the _id.

//Old route name /record/validAccount
recordRoutes.route("/users/validAccount").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        let query = { email: req.body.email, password: req.body.password }
        const user = await db_connect.collection("users").findOne(query);

        if (user) {
            req.session.email = user.email; //SET THE SESSION ID TO THE USER EMAIL, THIS WHAT VALIDATES IF THE USER IS CORRECT
            return res.status(200).json({ message: "Login successful" });
        } else {
            return res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        throw err;
    }
});


// List all users
//API
//localhost:5000/users/listAllUsers
recordRoutes.route("/users/listAllUsers").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let projection = { accountNumber: 1, firstName: 1, lastName: 1, email: 1, phoneNumber: 1, role: 1, savings: 1, checking: 1, investing: 1 };

        const results = await db_connect.collection("users").find({}, { projection }).toArray();
        res.json(results)
    } catch (err) {
        throw err;
    }
});

// old route name record / getUserBySession
recordRoutes.route("/users/getUserBySession").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();

        let query = { email: req.session.email }; //LOOK UP THE COOKIE EMAIL
        const user = await db_connect.collection("users").findOne(query); //FILTER IT by the found email
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ message: "error" }); //if no email was found, 
    }

});

// find users by user email
//API
//localhost:5000/users/getUser/JohnDoe@gmail.com
recordRoutes.route("/users/getUser/:email").get(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let projection = { firstName: 1, lastName: 1, email: 1, phoneNumber: 1, role: 1, savings: 1, checking: 1, investing: 1 };

        const result = await db_connect.collection("users").findOne(myquery, { projection });

        res.json(result)
    } catch (err) {
        throw err;
    }
});

// Add a new user.
//API IT WORKS
//localhost:5000/users/addUser/
//{   
//    "email" : "bradonbarfuss@gmail.com",
//    "firstName" : "Bradon",
//   "lastName" : "Barfuss",
//   "phoneNumber" : "8016980000",
//    "password" : "12345",
//    "role" : "Admin"
//}
recordRoutes.route("/users/addUser").post(async (req, res) => {
    try {
        //make account number
        const min = 100000
        const max = 999999
        const accountNumberValue = Math.floor(Math.random() * (max - min + 1)) + min

        let db_connect = dbo.getDb();
        let myobj = {
            email: req.body.email,
            accountNumber: accountNumberValue,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            role: req.body.role,
            savings: 0,
            checking: 0,
            investing: 0
        };
        let query = { email: req.body.email }
        let countValues = await db_connect.collection("users").countDocuments(query)
        if (countValues > 0) {
            return await res.status(400).json({ message: "Duplicate Email, try different email" })
        }
        const results = db_connect.collection("users").insertOne(myobj);
        res.json(results);
    } catch (err) {
        throw err;
    }
});


//Update a Users Role by the users email address
//API
//localhost:5000/users/updateRole/bradonbarfuss@gmail.com
//{   
//    "role" : "Admin"
//}
recordRoutes.route("/users/updateRole/:email").post(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { email: req.params.email };
        let newvalues = {
            $set: {
                role: req.body.role
            },
        };
        const result = await db_connect.collection("users").updateOne(myquery, newvalues)
        res.json(result)
    } catch (err) {
        throw err;
    }
});


// Delete Users by users ID
// /:id"
recordRoutes.route("/users/deleteUser/:id").delete(async (req, res) => {
    try {
        let db_connect = dbo.getDb();
        let myquery = { _id: new ObjectId(req.params.id) };
        const result = db_connect.collection("users").deleteOne(myquery);
        res.json(result)
    } catch (err) {
        throw err;
    }
});

module.exports = recordRoutes;