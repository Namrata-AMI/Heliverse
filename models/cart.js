const mongoose = require('mongoose');
const user = require("./user.js")

const userSchema = new mongoose.Schema({
    cart: [
        { 
        type: mongoose.Schema.Types.ObjectId,   //Array of user references for the cart
         ref: 'user'
         }
    ] 
});

module.exports = mongoose.model('cart', userSchema);
