
const { OpenRouter } = require('@openrouter/sdk');
require('dotenv').config();

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error('OPENROUTER_API_KEY não está definida no .env');
}

const test = async () => {
  try {
    const openrouter = new OpenRouter({ apiKey });
    console.log('Calling OpenRouter with SDK...');

    const result = await openrouter.chat.send({
      chatRequest: {
        model: 'openai/gpt-oss-20b:free',
        messages: [
          { role: 'system', content: 'Test' },
          { role: 'user', content: 'Hello' }
        ]
      }
    });

    console.log('Response:', result);
    console.log('Content:', result.choices[0].message.content);
  } catch (err) {
    console.error('Error:', err);
  }
};

test();
