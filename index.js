var express = require('express');
var app = express();
var cors = require('cors');
var dal = require('./dal.js');
const admin   = require('./admin.js');
const firebase = require('./firebase.js');
app.use(express.static('public'));
app.use(cors());



//create user
app.get('/account/create/:name/:email/:password', function (req, res) {
    res.send({
        name: req.params.name,
        email: req.params.email,
        password: req.params.password
    });
});

app.get('/account/alltransactions/:email', function(req, res) {
    try {
        dal.getAllTransactions(req.params.email).
        then((docs) => {
            console.log(docs);
            res.send(docs);
        })
    }
    catch (e) {
        console.log(e);
        res.send(e.message);
    }
})

//get all data
app.get('/account/all/:email/:password', function(req,res) {
    try {
        dal.all(req.params.email, req.params.password).
        then((docs) => {
            console.log(docs);
            res.send(docs);
        })
    }
    catch (e) {
        console.log(e);
        res.send(e.message);
      }
})

app.get('/account/login/:email/:password', function (req, res) {
    console.log('hello ' + req.params.email, req.params.password);
   try {
    executeLogin(req.params.email, req.params.password);
    async function executeLogin(email, password) {
        const auth  = firebase.auth();
        await auth.signInWithEmailAndPassword(email, password)
            .then((response) => {
                console.log('index server side res ' + JSON.stringify(response));
                response.user.getIdToken().then(token => {
                    console.log('token ' + JSON.stringify(token));
                    dal.balance(req.params.email, req.params.password).
                        then((docs) => {
                            console.log(docs);
                            res.send({"token": token, "error": '',"balance": docs});
                        })
                })
            })
            .catch((e) => {
                console.log('index login error ' + e);
                res.send({"token": '', "error": e.message,"balance": ''});
            })
    }
   } catch(e) {
    res.send({"token": '', "error": e,"balance": 0});
   }
})

//make transaction
app.get('/account/transaction/:email/:amount/:transType/:date/:balance', function (req, res) {
    const idToken = req.headers.authorization;
    console.log('route toke ' + idToken);
    admin.auth().verifyIdToken(idToken)
        .then(function(decodedToken) {
            console.log('decodedToken:',decodedToken);
        })
        
    dal.transaction(req.params.email, String(req.params.balance))
    .then((result) => {
        if (result.modifiedCount === 1) {
            console.log(result);
            res.send({"status": "success"});
        } else {
            res.send({"status": "failed"});
        }
        dal.enterTransToDb(req.params.email, req.params.date, req.params.transType, String(req.params.amount))
        .then((result) => {
            if (result.modifiedCount === 1) {
                console.log(result);
                res.send({"status": "success"});
            } else {
                res.send({"status": "failed"});
            }
        })
        .catch((error) => {
            console.log('error in index ' + error);
            res.send({"status": error});
        });
    })
    .catch((error) => {
        console.log('error in index ' + error);
        res.send({"status": error});
    });
});

app.get('/account/logout', function (req, res) {
    console.log('logout route');
    const auth  = firebase.auth();
    auth.signOut()
        .then(function() {
            // Sign-out successful.
            console.log('good logout');
            res.send({"error": ''});
        })
        .catch(function(error) {
            console.log('bad logout');
            // An error happened
            res.send({"error": error});
        });
});



var port = 3000;
app.listen(port);
console.log(`Running on port ${port}`);