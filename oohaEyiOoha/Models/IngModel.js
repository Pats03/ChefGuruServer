const mongoose = require('mongoose');

const IngSchema = new mongoose.Schema({
    ingredient: String,
})


module.exports = mongoose.model('ingredients', IngSchema);