const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); //enable token that server passes back to client upon successful authorization (login) to indicate authentication (reusable)

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        //if we make it here then the user we tried to post already exists
        return res.status(409).json({
          message: "Email exists"
        });
      } else {
        //if no conflict, hash the password and create the user, store on db
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          //10 is the number of salting rounds (safe baseline is 10). The salting protects the hash from decryption using dictionary tables by adding random strings before encrypting
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  //See if we got a user
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      //check if a user was found
      if (user.length < 1) {
        //user will be an array of 1
        return res.status(401).json({
          //don't say 'doesn't exist' because cyber attackers can use the msg to figure out what emails do exist on the db
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          //if comparison found incorrect password
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          //comparison found correct password
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY, //use environment variable from nodemon.json
            {
              expiresIn: "1h"  //login token (that indicates you are authorized) lasts for 1 h, accepts time in seconds or string indicating time period (check docs)
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:userId", (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      result.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
