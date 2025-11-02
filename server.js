const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root route for browser check
app.get('/', (req, res) => {
  res.send('✅ Chatbot server is up and running with Hugging Face!');
});

// Chat endpoint using Hugging Face Inference API
app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        inputs: userMessage,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const reply = response.data?.[0]?.generated_text || 'No response';
    res.json({ reply });
  } catch (error) {
    console.error('Hugging Face error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Use Render-compatible port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
