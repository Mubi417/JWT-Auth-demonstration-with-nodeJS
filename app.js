const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const login = {
    user_id: 30001,
    username: "Mubi4198",
    password: "yuhshakkdngsfavdtdfys"
}

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

const auth = (req, res, next) => {
    
    try {
        //every subsequent request after login would be sent with the authorization header containing the received token
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_STRING');
        const userID = decodedToken.userID;

        // if request contains user_id and the id does not correspond to id in the token
        if (req.body.user_id && req.body.user_id != userID) {
            return res.status(401).json({message: 'unauthorized'});
            
        } else {
            next();
        }

    } catch {
        return res.status(401).json({message: 'unauthorized'});
    }

};

app.post('/login', (req, res, next) => {

    if (!req.body.username || !req.body.password || (!req.body.username && !req.body.password)) {
        return res.status(404).json({message: 'inavlid parameters'});
    } else {
        if (req.body.username == login.username && req.body.password == login.password) {
            const token = jwt.sign(
                {userID: login.user_id},
                'RANDOM_TOKEN_STRING',
                {expiresIn: '2hr'}
            );

            res.status(200).json({
                userID: login.user_id,
                token: token,
                message: 'login successful',
                status: 'success'
            });


        } else {
            return res.status(401).json({message: 'invalid login details'});
        }

    }


});

app.get('/getstuff', auth, (req, res, next) => {
    const stuff = {
        name: 'stuff',
        type: 'better stuff',
        aim: 'best stuff',
        peak: 'ultimate stuff',
    };

    res.status(200).json({data: stuff, message: 'stuff found', status: 'success'});

});


module.exports = app;