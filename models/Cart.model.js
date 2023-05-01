const {Schema, model, default: mongoose, SchemaTypes} = require('mongoose');

const cartSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    items: [{product: {type: Schema.Types.ObjectId, ref: 'Product'}, quantity: {type: Number, default:1} }]
})

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart;