const Product = require('../models/Product.model')
const User = require('../models/User.model')
const router = require('express').Router()

// Display product form: 
router.get('/create', (req, res) => {
    res.render('create-product')
})
// Create the product:
router.post('/create', (req, res) => {
    Product.create(req.body)
    .then(() => { res.redirect('/products/products') })
    .catch((error) => { res.render('create-product', {errorMessage: 'Something is wrong plz fill the form again' }) })
})
// Display all products:
router.get('/products', (req, res) => {
    Product.find()
    .then((allProducts) => { res.render('products', {allProducts}) })
    .catch((error) => res.render('Error', {errorMessage: 'Can not get data from database, sorry'}))
    })
// Edit the product:
router.get('/edit/:productId', async(req, res) => {
    const specificProduct = await Product.findById(req.params.productId)
    console.log("here is a specific", specificProduct)
    res.render('edit-product', specificProduct)
})

module.exports = router;