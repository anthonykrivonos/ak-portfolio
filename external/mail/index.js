/*
Anthony Krivonos
external/mail/index.js
09.17.2018
*/

'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const cors = require('cors');
const morgan  = require('morgan');
const jwt = require('jwt-simple');
const moment = require('moment');

const PORT = process.env.PORT || 3000;
const REALM = "anthonykrivonosmail";

const app = express();
const upload = multer();

const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
            user: 'info.anthonykrivonos@gmail.com',
            pass: 'infoakweb123'
      }
});

const corsOptions = {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": true,
      "allowedHeaders": 'Content-Type,Authorization,x-access-token,X-Requested-With,Access-Control-Allow-Methods'
}

const STATUS = {
      OK: 200,
      CREATED: 201,
      NO_CONTENT: 204,
      NOT_MODIFIED: 304,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      SERVER_ERROR: 500
}

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.set('jwtTokenSecret', REALM);

app.post('/auth', upload.array(), function (req, res, next) {
      try {
            if (req.body && req.body.uid && req.body.uid.length > 5) {
                  let expires = moment().add('minutes', 1).valueOf();
                  let token = jwt.encode({
                        iss: req.body.uid,
                        exp: expires
                  }, app.get('jwtTokenSecret'));
                  res.status(STATUS.OK).jsonp({
                        "auth-token": token,
                        "from-uid": req.body.uid,
                        "expires": expires
                  });
            }
            else {
                  res.status(STATUS.BAD_REQUEST).send();
            }
      } catch (e) {
            res.status(STATUS.BAD_REQUEST).send();
      }
      return;
});

app.post('/contact', upload.array(), function (req, res, next) {
      var token = req.headers['x-access-token'];
      var fields = (req.body != null && req.body.name != null && req.body.email != null && req.body.subject != null && req.body.body != null);
      if (token && fields) {
            try {
                  var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
                  console.log(`Decoded`);
                  if (decoded.exp <= Date.now()) {
                        console.log(`Expired auth token`);
                        res.status(STATUS.BAD_REQUEST).send('Auth token has expired', 400);
                  } else {
                        console.log(`Generating email.`)
                        var date = new Date();
                        var html = `
                        <b>${req.body.subject}</b>
                        <hr/>
                        <h1>${req.body.body}</h1>
                        <hr/>
                        <h3><a href="mailto:${req.body.email}">${req.body.name} <${req.body.email}></a></h3>
                        `;

                        let mailOptions = {
                              from: `${req.body.name} <${req.body.email}>`,
                              to: 'info@anthonykrivonos.com',
                              subject: `${req.body.subject} - ${req.body.name}`,
                              html: html,
                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                              if (error) {
                                    console.log(`An error occurred:\n${error}`);
                                    res.status(STATUS.BAD_REQUEST).send();
                                    return console.log(error);
                              }
                              console.log(`Inquiry Sent From ${req.body.name} <${req.body.email}>`)
                              res.status(STATUS.OK).send(html);
                              return;
                        });
                  }
            } catch (e) {
                  console.log(`Couldn't get credentials.`);
                  res.status(STATUS.UNAUTHORIZED).send();
            }
      } else {
            console.log(`Incorrect body.`);
            res.status(STATUS.BAD_REQUEST).send();
      }
      return;
});

app.listen(PORT, function () {
      console.log(`Anthony Krivonos Website Mail listening on port ${PORT}!`)
});
