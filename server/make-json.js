require('dotenv').config();
const fs = require('fs');

async function listModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
    console.log('done');
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

listModels();
