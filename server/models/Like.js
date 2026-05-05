const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

// Compound unique index so a user can only like a recipe once
likeSchema.index({ recipe: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
