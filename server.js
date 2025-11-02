const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();

// Enable CORS for all origins (you can restrict later)
app.use(cors());

// Parse incoming JSON
app.use(bodyParser.json());

// OpenAI setup using latest SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Root route for browser check
app.get('/', (req, res) => {
  res.send('✅ ChatGPT server is up and running!');
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userMessage }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Use Render-compatible port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
