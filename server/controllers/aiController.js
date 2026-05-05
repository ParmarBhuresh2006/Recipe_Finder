const { GoogleGenerativeAI } = require('@google/generative-ai');
const Recipe = require('../models/Recipe');

// @desc    Chat with AI Cooking Assistant
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured.' });
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Use gemini-flash-latest as the fast, versatile model for chat
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    // Fetch up to 50 published recipes to provide as context
    const recipes = await Recipe.find({ status: 'published' })
      .select('title ingredients difficulty prepTime cookTime category tags')
      .limit(50);
      
    let recipeContext = '';
    if (recipes.length > 0) {
      recipeContext = "Here are the recipes currently available in our app's database:\\n";
      recipes.forEach((r, idx) => {
        const ingredientsText = r.ingredients && r.ingredients.length > 0 
          ? r.ingredients.map(i => `${i.amount} ${i.name}`).join(', ') 
          : 'N/A';
        recipeContext += `${idx + 1}. Title: ${r.title} | Category: ${r.category || 'N/A'} | Difficulty: ${r.difficulty || 'N/A'} | Ingredients: ${ingredientsText}\\n`;
      });
      recipeContext += "\\nTry to suggest these recipes whenever the user asks for ideas or ingredients that match them. If none match or if they ask a general question, you can answer normally.\\n";
    }

    // Provide some context to the AI so it behaves like a cooking assistant
    const prompt = `You are an expert, friendly AI cooking assistant for a recipe finding web application. 
    
${recipeContext}
The user asks: "${message}"

Please provide a helpful, concise, and inspiring response. If they are asking for recipes based on ingredients, try to recommend from the app's database first!`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      reply: text,
    });

  } catch (error) {
    console.error('Error with Gemini API:', error);
    next(error);
  }
};

module.exports = {
  chatWithAI,
};
