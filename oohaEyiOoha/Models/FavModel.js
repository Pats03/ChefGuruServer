const mongoose = require('mongoose');

const FavSchema = new mongoose.Schema(
  {
    recipeName: String,
    recipeIngrids: [String],
    recipeStps: [String],
    user: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('favourites', FavSchema);
