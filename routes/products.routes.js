const Product = require('../models/Product.model')
const User = require('../models/User.model')
const Cart = require('../models/Cart.model')
const router = require('express').Router()
const uploader = require('../middleware/cloudinary.config');
 const {isLoggedIn} = require('../middleware/route-guard') 


// Display product form: 
router.get('/create',isLoggedIn, (req, res) => {
    res.render('create-product')
})
// Create the product:
router.post('/create', isLoggedIn, uploader.single("img"), (req, res, next) => {
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
router.get('/edit/:productId', isLoggedIn, async(req, res) => {
    try{ 
    const specificProduct = await Product.findById(req.params.productId)
    res.render('edit-product', {specificProduct})
    }
    catch {((err) => console.log(err))}
})
// Send the product after edit :
router.post('/edit/:productId', isLoggedIn,  uploader.single("img"), async(req, res) => {
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
router.get('/delete/:productId', isLoggedIn, async(req, res) => {
    try{ 
    const {productId} = req.params
    const deletedProduct = await Product.findByIdAndDelete(productId)
    res.redirect('/products/products')
    }
    catch {((err) => console.log(err))}
})
// Read more about a product: 
router.get('/details/:productId', async(req, res) => {
  try{ 
    const {productId} = req.params
    const oneProduct = await Product.findById(productId)
    res.render('product-details', {oneProduct})
  }
  catch {((err) => console.log(err))}
})
// Handle the cart request:
router.post('/cart/:productId', isLoggedIn, async(req, res) => {
  try{
    const {productId} = req.params
    const specificProduct = await Product.findById(productId)
    const specificUser = req.session.user
    const cart = await Cart.findOne({user: specificUser._id})
    let cartId
    if (!cart){
      const newCart = await Cart.create({user: specificUser._id, items:[{product: specificProduct}] })
      const updatedUser = await User.findByIdAndUpdate(specificUser._id, {cart: newCart}, {new: true})
      cartId = newCart._id
    } else { 
      let updatedCart
      const itemIndex = cart.items.findIndex(item => item.product.equals(specificProduct._id))
      if (itemIndex === -1) {
        updatedCart = await Cart.findByIdAndUpdate(cart._id, {$push: {items: {product: specificProduct}}}, {new: true})
      } else {
        const item = cart.items[itemIndex]
        item.quantity++
        updatedCart = await Cart.findByIdAndUpdate(cart._id, {$set: {[`items.${itemIndex}`]: item}}, {new: true})
      }
      const updatedUser = await User.findByIdAndUpdate(specificUser._id, {cart: updatedCart}, {new: true})
      cartId = updatedCart._id
    }
    res.redirect(`/products/cart/${cartId}`)
  }
  catch (error) {
    console.log(error)
  }
})
// View cart:
router.get('/cart/:cartId', isLoggedIn, async(req, res) => {
  try { 
    const {cartId} = req.params
    // The following line is written by antonio:
  const cart = await Cart.findById(cartId).populate({path: "items", populate: {path: "product", model: "Product"}})
  res.render('cart', {cart})
  }
  catch {((err) => console.log(err))}
})
//Delete an item from cart:
router.delete('/cart/:itemId', async(req, res) => {
  try{ 
  const { itemId } = req.params
  const {specificUser} = req.session.user
  const cart = await Cart.findOne({ user: specificUser_id})
  const itemIndex = cart.items.findIndex(item => item.product.equals(specificProduct._id))
  cart.items.splice(itemIndex, 1)
  const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, { new: true })
  const updatedUser = await User.findByIdAndUpdate(specificUser._id, {cart: updatedCart}, {new: true})
  res.redirect(`/products/products/cart/${updatedCart._id}`)
  }
  catch {((err) => console.log(err))}
})
// Increment the quantity of an item in the cart:
router.post('/cart/:cartId/:itemId/increment', async(req, res) => {
  try {
    const {itemId, cartId} = req.params
    const {specificUser} = req.session.user
    console.log(itemId, specificUser)
    const cart = await Cart.findOne({ _id: cartId})
    console.log(cart)
    const anItem = cart.items.find(item => item.product.equals(itemId))
    anItem.quantity +=1 
    const updatedCart = await Cart.findByIdAndUpdate(cart._id, cart, { new: true })
    res.redirect(`/products/cart/${cartId}`)
  } 
  catch {((err) => console.log(err))}
})
// Decrement the quantity of an item in the cart:
router.post('/cart/:itemId/decrement', async(req, res) => {
  try {
    const {itemId} = req.params
    const {specificUser} = req.session.user
    const cart = await Cart.findOne({ user: specificUser._id })
    const anItem = cart.items.findOne(item => item.product.equals(itemId))
  } 
  catch {((err) => console.log(err))}
})
module.exports = router;