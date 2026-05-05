require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Since listModels isn't always straightforward on simple API key usage, 
    // let's try a few standard ones.
    const modelsToTest = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.0-pro', 'gemini-pro'];
    
    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const res = await model.generateContent('Hi');
        console.log(`Success with: ${modelName}`);
        return; // Break out if successful
      } catch (e) {
        console.log(`Failed with: ${modelName} - ${e.message.substring(0, 50)}`);
      }
    }
  } catch (err) {
    console.error('Fatal error setting up test:', err);
  }
}

listModels();
