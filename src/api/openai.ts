import axios from 'axios';

const API_URL = 'http://localhost:1234/v1/chat/completions';
const API_KEY = 'lm-studio';

export async function chatCompletion(message: string) {
  try {
    const response = await axios.post(API_URL, {
      model: 'abetlen/Phi-3.5-vision-instruct-gguf',
      messages: [{ role: 'user', content: message }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    } else {
      console.error('Unexpected API response structure:', response.data);
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
