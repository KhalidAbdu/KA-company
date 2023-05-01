const {Schema, model, default: mongoose, SchemaTypes} = require('mongoose');

const productSchema = new Schema({
    name:  {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    img: {
        path: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
      },
    description: {type: String}
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product;