const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/db");
const User = require("../models/user"); // User model
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get("/logowanie", (req, res) => {
    res.render("users/formlog", {
        viewTitle: "Zaloguj"
    })
})
router.get("/rejestracja", (req, res) => {
    res.render("users/formreg", {
        viewTitle: "Zarejestruj"
    })
})

router.post("/rejestracja", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
            res.redirect("/users/logowanie")
        }
    });
});
router.post("/logowanie", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    // Find user by email
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                const sessUser = { id: user.id, name: user.name, email: user.email };
                req.session.user = sessUser; // Auto saves session data in mongo store
                localStorage.setItem("ID", user.id);
                console.log({ msg: " Logged In Successfully", sessUser });
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    name: user.name
                };
                // Sign token
                jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.redirect("/muzyka/list")
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
            }
        });
    });
});

module.exports = router;