require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

const User = require('./models/User');
const Recipe = require('./models/Recipe');

const CSV_FILE_PATH = '../IndianFoodDatasetCSV.csv';
const IMPORT_LIMIT = 50;

const VALID_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Vegetarian', 'Quick Meals', 'Baking', 'Soups & Stews'];

const categorize = (course, diet) => {
  const c = String(course || '').toLowerCase();
  const d = String(diet || '').toLowerCase();
  
  if (c.includes('breakfast')) return 'Breakfast';
  if (c.includes('lunch')) return 'Lunch';
  if (c.includes('dinner')) return 'Dinner';
  if (c.includes('dessert')) return 'Desserts';
  if (c.includes('side dish') || c.includes('main course')) return 'Lunch'; 
  if (d.includes('vegetarian')) return 'Vegetarian';
  
  return 'Lunch'; // default
};

async function importData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected.');

    // Find or create the default chef user
    let chef = await User.findOne({ email: 'importer@recipefinder.com' });
    if (!chef) {
      chef = new User({
        name: 'Dataset Importer',
        email: 'importer@recipefinder.com',
        password: 'password123',
        role: 'chef'
      });
      await chef.save();
      console.log('Created default chef user.');
    }

    const recipes = [];
    
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csv())
      .on('data', (row) => {
        if (recipes.length >= IMPORT_LIMIT) return;

        const rawIngredients = row.TranslatedIngredients || row.Ingredients || '';
        const ingredientList = rawIngredients.split(',').map(i => ({ name: i.trim(), amount: '' })).filter(i => i.name);
        
        const rawInstructions = row.TranslatedInstructions || row.Instructions || '';
        const instructionList = rawInstructions.split('.').map(s => s.trim()).filter(s => s).map((s, idx) => ({ stepNumber: idx + 1, instruction: s }));

        const recipeDoc = {
          chef: chef._id,
          title: row.TranslatedRecipeName || row.RecipeName || 'Unknown Recipe',
          description: rawInstructions.substring(0, 150) + '...',
          ingredients: ingredientList,
          steps: instructionList,
          category: categorize(row.Course, row.Diet),
          cuisine: row.Cuisine || 'Indian',
          difficulty: 'Medium',
          prepTime: parseInt(row.PrepTimeInMins) || 15,
          cookTime: parseInt(row.CookTimeInMins) || 30,
          servings: parseInt(row.Servings) || 4,
          tags: [row.Diet, row.Course].filter(Boolean),
          status: 'published'
        };

        recipes.push(recipeDoc);
      })
      .on('end', async () => {
        console.log(`Successfully parsed ${recipes.length} recipes from CSV. Processing insertion...`);
        try {
          if (recipes.length > 0) {
            await Recipe.insertMany(recipes);
            console.log(`Inserted ${recipes.length} recipes into MongoDB successfully!`);
          }
        } catch (insertErr) {
          console.error('Error inserting recipes:', insertErr);
        } finally {
          mongoose.connection.close();
        }
      });

  } catch (err) {
    console.error('Initial error:', err);
    mongoose.connection.close();
  }
}

importData();
