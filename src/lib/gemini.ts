import 'dotenv/config'; // Load variables from .env (make sure it's named .env, not .env.local)
import axios from 'axios';

export async function chatWithGemini(prompt: string) {
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log('[GEMINI] Using key:', apiKey?.slice(0, 10), '...');

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': apiKey
                },
                timeout: 10000 // 10s timeout
            }
        );

        const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return result || '⚠️ Gemini responded, but without usable content.';
    } catch (err: any) {
        if (err.response) {
            console.error('[GEMINI] Response error:', err.response.status, err.response.data);
        } else if (err.request) {
            console.error('[GEMINI] No response received:', err.request);
        } else {
            console.error('[GEMINI] Error setting up request:', err.message);
        }

        return '⚠️ Gemini API error';
    }
}
