const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    ingredients: [{ name: String, amount: String }],
    steps: [{ stepNumber: Number, instruction: String }],
    category: {
      type: String,
      enum: [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Desserts',
        'Vegetarian',
        'Quick Meals',
        'Baking',
        'Soups & Stews',
      ],
    },
    cuisine: String,
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
    prepTime: Number, // in minutes
    cookTime: Number,
    servings: Number,
    tags: [String],
    image: { url: String, publicId: String },
    video: { url: String, publicId: String },
    nutritionFacts: {
      calories: Number,
      protein: Number,
      carbohydrates: Number,
      fat: Number,
      fiber: Number,
      sodium: Number,
    },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recipe', recipeSchema);
