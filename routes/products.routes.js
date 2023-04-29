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
    res.render('edit-product', {specificProduct})
})
// Send the product after edit :
router.post('/edit/:productId', async(req, res) => {
    const {productId} = req.params
    const updatedProduct = await Product.findByIdAndUpdate((productId), req.body, {new: true})
    res.redirect('/products/products')
})
// Delete product:
router.get('/delete/:productId', async(req, res) => {
    const {productId} = req.params
    const deletedProduct = await Product.findByIdAndDelete(productId)
    res.redirect('/products/products')

})

module.exports = router;