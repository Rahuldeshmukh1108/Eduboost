import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import Tesseract from 'tesseract.js';
import { Groq } from 'groq-sdk';


dotenv.config();


const app = express();
const port = process.env.PORT || 5500;


// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '.')));


const groq = new Groq();


// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Route to process OCR
app.post('/api/extract-text', (req, res) => {
  const { image } = req.body;


  if (!image) {
    return res.status(400).json({ success: false, error: 'No image data received.' });
  }


  Tesseract.recognize(image, 'eng')
    .then(({ data: { text } }) => {
      console.log('OCR Result:', text);
      res.json({ success: true, text });
    })
    .catch(err => {
      console.error('Tesseract Error:', err);
      res.status(500).json({ success: false, error: 'OCR failed' });
    });
});


// Route to process AI answer
app.post('/api/get-answer', async (req, res) => {
  const { text, imageUrl } = req.body;


  if (!text && !imageUrl) {
    return res.status(400).json({ success: false, error: 'No input provided.' });
  }


  try {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: text || '' }
    ];


    // Remove the image handling since Groq API doesn't support image input
    // in the current format
    const chatCompletion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages,
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false
    });


    const reply = chatCompletion.choices[0]?.message?.content || 'No response';
    res.json({ success: true, answer: reply });
  } catch (err) {
    console.error('Groq API Error:', err);
    res.status(500).json({ success: false, error: err.message || 'AI response failed' });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
