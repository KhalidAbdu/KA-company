const express = require('express');
const { isLoggedIn } = require('../middleware/route-guard');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/profile", isLoggedIn, (req, res, next) => {
  console.log(req.session)
  res.render("profile", {user: req.session.user});
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err)
    res.redirect('/')
  })
})

module.exports = router;
