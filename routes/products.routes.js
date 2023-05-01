const Product = require('../models/Product.model')
const User = require('../models/User.model')
const router = require('express').Router()
const uploader = require('../middleware/cloudinary.config');


// Display product form: 
router.get('/create', (req, res) => {
    res.render('create-product')
})
// Create the product:
router.post('/create', uploader.single("img"), (req, res, next) => {
    console.log('file is: ', req.file)
    if (!req.file) {
        console.log(req.file.img)
      next(new Error('No file uploaded!'));
      return;
    }
    Product.create({
        name: req.body.name,
        price: req.body.price,
        img: {
          path: req.file.path,
          filename: req.file.filename,
        },
        description: req.body.description,
      })
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
    try{ 
    const specificProduct = await Product.findById(req.params.productId)
    res.render('edit-product', {specificProduct})
    }
    catch {((err) => console.log(err))}
})
// Send the product after edit :
router.post('/edit/:productId', uploader.single("img"), async(req, res) => {
    console.log('file is: ', req.file)
    if (!req.file) {
        console.log(req.file.img)
      next(new Error('No file uploaded!'));
      return;
    }
    try{ 
    const {productId} = req.params
    const product = {
        name: req.body.name,
        price: req.body.price,
        img: {
            path: req.file.path,
            filename: req.file.filename,
          },
        description: req.body.description
      }
    const updatedProduct = await Product.findByIdAndUpdate((productId), product, {new: true})
    res.redirect('/products/products')
    }
    catch {((err) => console.log(err))}
})
// Delete product:
router.get('/delete/:productId', async(req, res) => {
    try{ 
    const {productId} = req.params
    const deletedProduct = await Product.findByIdAndDelete(productId)
    res.redirect('/products/products')
    }
    catch {((err) => console.log(err))}
})
// Read more about a product : 
router.get('/details/:productId', async(req, res) => {
    const {productId} = req.params
    const oneProduct = await Product.findById(productId)
    res.render('product-details', {oneProduct})

})

module.exports = router;