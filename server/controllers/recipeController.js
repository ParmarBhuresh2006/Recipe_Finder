const Recipe = require('../models/Recipe');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'recipefinder' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readableStream = new Readable({
      read() {
        this.push(buffer);
        this.push(null);
      },
    });
    readableStream.pipe(uploadStream);
  });
};

// @desc    Create a recipe
// @route   POST /api/recipes
// @access  Private (Chef)
const createRecipe = async (req, res, next) => {
  try {
    const { title, description, ingredients, steps, category, cuisine, difficulty, prepTime, cookTime, servings, tags } = req.body;

    let imageObj = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageObj = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    const recipe = new Recipe({
      chef: req.user._id,
      title,
      description,
      ingredients: ingredients ? JSON.parse(ingredients) : [],
      steps: steps ? JSON.parse(steps) : [],
      category,
      cuisine,
      difficulty,
      prepTime,
      cookTime,
      servings,
      tags: tags ? JSON.parse(tags) : [],
      image: imageObj,
    });

    const createdRecipe = await recipe.save();
    res.status(201).json(createdRecipe);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all recipes (with search & filter)
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res, next) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const sort = req.query.sort || '-createdAt';

    const recipes = await Recipe.find({ ...keyword, ...category, status: 'published' })
      .populate('chef', 'name profileImage')
      .sort(sort);

    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('chef', 'name profileImage bio followers');

    if (recipe) {
      // Increment views count
      recipe.viewsCount += 1;
      await recipe.save();
      
      res.json(recipe);
    } else {
      res.status(404);
      throw new Error('Recipe not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private (Chef - Only Owner)
const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      if (recipe.chef.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this recipe');
      }

      recipe.title = req.body.title || recipe.title;
      recipe.description = req.body.description || recipe.description;
      recipe.ingredients = req.body.ingredients ? JSON.parse(req.body.ingredients) : recipe.ingredients;
      recipe.steps = req.body.steps ? JSON.parse(req.body.steps) : recipe.steps;
      recipe.category = req.body.category || recipe.category;
      recipe.cuisine = req.body.cuisine || recipe.cuisine;
      recipe.difficulty = req.body.difficulty || recipe.difficulty;
      recipe.prepTime = req.body.prepTime || recipe.prepTime;
      recipe.cookTime = req.body.cookTime || recipe.cookTime;
      recipe.servings = req.body.servings || recipe.servings;
      recipe.tags = req.body.tags ? JSON.parse(req.body.tags) : recipe.tags;

      if (req.file) {
        if (recipe.image && recipe.image.publicId) {
          await cloudinary.uploader.destroy(recipe.image.publicId);
        }
        const result = await uploadToCloudinary(req.file.buffer);
        recipe.image = {
          url: result.secure_url,
          publicId: result.public_id,
        };
      }

      const updatedRecipe = await recipe.save();
      res.json(updatedRecipe);
    } else {
      res.status(404);
      throw new Error('Recipe not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private (Chef - Only Owner or Admin)
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (recipe) {
      if (recipe.chef.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this recipe');
      }
      
      if (recipe.image && recipe.image.publicId) {
        try {
           await cloudinary.uploader.destroy(recipe.image.publicId);
        } catch(e) {
           console.error('Failed to destroy image:', e.message);
        }
      }

      await recipe.deleteOne();
      res.json({ message: 'Recipe removed' });
    } else {
      res.status(404);
      throw new Error('Recipe not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending recipes
// @route   GET /api/recipes/trending/now
// @access  Public
const getTrendingRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ status: 'published' })
      .populate('chef', 'name profileImage')
      .sort({ likesCount: -1, viewsCount: -1 })
      .limit(10);
    res.json(recipes);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getTrendingRecipes,
};
