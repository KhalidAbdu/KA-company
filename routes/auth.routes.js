const express = require('express');
const router = express.Router();
const User = require ('../models/User.model')
const bcryptjs = require('bcryptjs')
const saltRounds = 11
const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


router.get("/", (req, res, next) => {});

//Get to display signup form :
router.get("/signup", (req, res, next) => {
    res.render("auth/signup")
});
//Post to handle form values : 
router.post("/signup", async(req, res, next) => {
    try{ 
    const possibleOne = await User.findOne({username: req.body.username})
    if(!possibleOne) {
        if(pwdRegex.test(req.body.password)){
            const salt = bcryptjs.genSaltSync(saltRounds)
            const passwordHash = bcryptjs.hashSync(req.body.password, salt)
            const newUser = await User.create({username: req.body.username, passwordHash})
            res.redirect('/auth/login')
        } else {
            res.render('auth/signup', {errorMessage: 'The password is too easy to hack', data: {username: req.body.username}})}
    } else {
        res.render('auth/signup', {errorMessage: 'Sorry... username is taken', data: {username: req.body.username}})
    }}
    catch (error) {console.log(error)}
});

//Get to display login form :
router.get("/login", (req, res, next) => {
    res.render("auth/login")
});
//Post to handle form values : 
router.post("/login", async(req, res, next) => {
    const user = await User.findOne({username: req.body.username})
    if (!user) {
        res.render('auth/login', {errorMessage: 'You are not a user, plz signup'})
    } else if (user && bcryptjs.compareSync(req.body.password, user.passwordHash)) {
        res.send(user)
    } else {
        res.render('auth/login', {errorMessage: 'Remember your password plz'})
    }
});

module.exports = router;