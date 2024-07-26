const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn.js");

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/record/validAccount").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();

    let query = { email: req.body.email, password: req.body.password }
    const user = await db_connect.collection("records").findOne(query);

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

recordRoutes.route("/update/:email").put(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };
    let newvalues = {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
      },
    };
    const result = db_connect.collection("records").updateOne(myquery, newvalues)
    console.log("1 role udpated")
    res.json(result)
  } catch (err) {
    throw err;
  }
});



// This section will help you get a list of all the records.
recordRoutes.route("/record").get(async (req, res) => {
  try {
    let db_connect = dbo.getDb("NonPaidIntern");
    let projection = { firstName: 1, lastName: 1, email: 1, phoneNumber: 1, role: 1, savings: 1, checking: 1 };//https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/read-operations/project/

    const results = await db_connect.collection("records").find({}, { projection }).toArray();
    res.json(results)
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/record/getUserBySession").get(async (req, res) => {
  try {
    
    let db_connect = dbo.getDb();

    let query = { email: req.session.email }; //LOOK UP THE COOKIE EMAIL
    const user = await db_connect.collection("records").findOne(query); //FILTER IT by the found email
    res.status(200).json(user);
  }catch (err) {
    res.status(400).json({ message: "error" }); //if no email was found, 
  }

});

// This section will help you get a single record by id
recordRoutes.route("/record/:email").get(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };
    let projection = { firstName: 1, lastName: 1, email: 1, phoneNumber: 1, role: 1, savings: 1, checking: 1 };//https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/read-operations/project/

    const result = await db_connect.collection("records").findOne(myquery, { projection });

    res.json(result)
  } catch (err) {
    throw err;
  }
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myobj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      role: "",
      savings: 0,
      checking: 0
    };

    let query = { email: req.body.email }
    let countValues = await db_connect.collection("records").countDocuments(query)
    if (countValues > 0) {
      return await res.status(400).json({ message: "Duplicate Email, try different email" }) //https://auth0.com/blog/how-to-implement-custom-error-responses-in-expressjs/
    }
    const results = db_connect.collection("records").insertOne(myobj);
    res.json(results);
  } catch (err) {
    throw err;
  }
});



// This section will help you update a record by id.
recordRoutes.route("/updateRole/:email").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };
    let newvalues = {
      $set: {
        role: req.body.role
      },
    };
    const result = db_connect.collection("records").updateOne(myquery, newvalues)
    console.log("1 role udpated")
    res.json(result)
  } catch (err) {
    throw err;
  }
});



recordRoutes.route("/updateSavings/:email").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };

    let newvalues = {

      $inc: { savings: req.body.savings } //https://stackoverflow.com/questions/71207726/creating-a-bank-transaction-with-express-mongo-db

    };
    const result = db_connect.collection("records").updateOne(myquery, newvalues)
    console.log("1 savings updated by", req.body.savings);
    res.json(result)
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/updateChecking/:email").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };
    let newvalues = {

      $inc: { checking: req.body.checking }

    };
    const result = db_connect.collection("records").updateOne(myquery, newvalues)
    console.log("1 checking udpated")
    res.json(result)
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/withdrawSavings/:email").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };
    let projection = { savings: 1 }
    emailWithSavings = await db_connect.collection("records").findOne(myquery, { projection })
    if (emailWithSavings.savings - req.body.savings < 0) {
      return await res.status(400).json({ message: "Withdraw to much money" }) //https://auth0.com/blog/how-to-implement-custom-error-responses-in-expressjs/

    }
    let newvalues = {

      $inc: { savings: -req.body.savings } //https://stackoverflow.com/questions/71207726/creating-a-bank-transaction-with-express-mongo-db

    };
    const result = db_connect.collection("records").updateOne(myquery, newvalues)
    console.log("1 saving decreased updated")
    return await res.status(200).json({ message: "It Worked" })
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/withdrawChecking/:email").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };
    let projection = { checking: 1 }
    emailWithChecking = await db_connect.collection("records").findOne(myquery, { projection })
    if (emailWithChecking.checking - req.body.checking < 0) {
      return await res.status(400).json({ message: "Withdraw to much money" }) //https://auth0.com/blog/how-to-implement-custom-error-responses-in-expressjs/

    }
    let newvalues = {

      $inc: { checking: -req.body.checking } //https://stackoverflow.com/questions/71207726/creating-a-bank-transaction-with-express-mongo-db

    };
    const result = db_connect.collection("records").updateOne(myquery, newvalues)
    console.log("1 Checking decreased updated")
    return await res.status(200).json({ message: "IT did it!" }) //https://auth0.com/blog/how-to-implement-custom-error-responses-in-expressjs/
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/CheckingToSaving/:email").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };
    let projection = { checking: 1, savings: 1 }
    emailWithChecking = await db_connect.collection("records").findOne(myquery, { projection })
    if (emailWithChecking.checking - req.body.checking < 0) {
      return await res.status(400).json({ message: "Withdraw to much money" }) //https://auth0.com/blog/how-to-implement-custom-error-responses-in-expressjs/

    }
    let newvalues = {

      $inc: { checking: -req.body.checking, savings: req.body.checking } //https://stackoverflow.com/questions/71207726/creating-a-bank-transaction-with-express-mongo-db

    };
    const result = db_connect.collection("records").updateOne(myquery, newvalues)
    return await res.status(400).json({ message: "IT did it!" })
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/SavingToCheckings/:email").post(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { email: req.params.email };
    let projection = { checking: 1, savings: 1 }
    emailWithSavings = await db_connect.collection("records").findOne(myquery, { projection })
    if (emailWithSavings.savings - req.body.savings < 0) {
      return await res.status(400).json({ message: "Withdraw to much money" })

    }
    let newvalues = {

      $inc: { savings: -req.body.savings, checking: req.body.savings } //https://stackoverflow.com/questions/71207726/creating-a-bank-transaction-with-express-mongo-db

    };
    const result = db_connect.collection("records").updateOne(myquery, newvalues)
    return await res.status(400).json({ message: "IT did it!" })
  } catch (err) {
    throw err;
  }
});




// This section will help you delete a record
recordRoutes.route("/:id").delete(async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    let myquery = { _id: new ObjectId(req.params.id) };
    const result = db_connect.collection("records").deleteOne(myquery);
    res.json(result)
    console.log("1 document deleted");

  } catch (err) {
    throw err;
  }
});

module.exports = recordRoutes;