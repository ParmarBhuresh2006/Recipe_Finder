const { GoogleGenerativeAI } = require('@google/generative-ai');
const Recipe = require('../models/Recipe');

// Wait to instantiate so we don't crash if env var isn't set yet during startup
const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

exports.handleChat = async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const genAI = getGenAI();
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
      recipeContext += "\\nUse these recipes if the user asks for suggestions or has matching ingredients. If they ask a general cooking question or order something else, handle it gracefully.\\n";
    }

    // System prompt behavior
    const systemPrompt = `You are a helpful and knowledgeable AI Chef assistant for the Recipe Finder app. 
    Users will ask you questions about cooking, recipes, ingredients, and how to use the app.
    Keep your answers concise, friendly, and formatted in Markdown. 
    If a question is completely unrelated to food, cooking, or the app, politely guide the user back to culinary topics.
    
    ${recipeContext}
    
    ${context ? `Here is some additional context about what the user is currently viewing: ${context}` : ''}
    
    User message: ${message}`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();

    res.status(200).json({
      success: true,
      data: responseText,
    });
  } catch (error) {
    console.error('Error in chat controller:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to communicate with AI Assistant',
      error: error.message 
    });
  }
};
