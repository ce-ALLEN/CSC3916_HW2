/*
 * CSC3916 HW2
 * File: server.js
 * Description: Web API scaffolding for Movie API
 */

let express = require('express');
let http = require('http');
let bodyParser = require('body-parser');
let passport = require('passport');
let authController = require('./auth');
let authJwtController = require('./auth_jwt');
db = require('./db')(); // hack -- execute to get actual object back
let jwt = require('jsonwebtoken');
let cors = require('cors');

let app = express();
app.use(cors());
app.use(bodyParser.json()); // avoid using JSON.parse
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

let router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    let json = {
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success:false, msg:'Please include both username and password to signup.'})
    } else {
        let newUser = {
            username: req.body.username,
            password: req.body.password
        };

        db.save(newUser);   // no duplicate checking
        res.json({success: true, msg: 'Successfully created new user.'})
    }
});

router.post('/signin', function (req, res) {
    let user = db.findOne(req.body.username);

    if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'})
    } else {
        if (req.body.password === user.password) {
            let userToken = { id: user.id, username: user.username }
            let token = jwt.sign(userToken, process.env.SECRET_KEY)
            res.json( {success: true, token: 'JWT' + token})
        }
        else {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'})
        }
    }
});

router.route('/movies')
    .delete(authController.isAuthenticated, function (req, res) {
        console.log(req.body);
        res = res.status(200);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        let o = getJSONObjectForMovieRequirement(req);
        res.json(o);
    })
    .put(authJwtController.isAuthenticated, function (req, res) {
        console.log(req.body);
        res = res.status(200);
        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }
        let o = getJSONObjectForMovieRequirement(req);
        res.json(o);
    });

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app;   // enable use in other files