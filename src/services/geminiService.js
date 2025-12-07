import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const hintModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-preview-09-2025',
  systemInstruction: `You are a cryptic, non-spoiler CTF hint generator. 
  Provide a single, short, and creative hint (2-3 sentences max) that guides the user to the starting point.
  Be mysterious and encouraging, but never give away the solution.
  Focus on the approach and mindset needed rather than specific technical details.`
});

const challengeModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-preview-09-2025',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        category: { 
          type: 'string', 
          enum: ['Web', 'Crypto', 'Pwn', 'Reverse', 'Forensics', 'Misc', 'Steganography']
        },
        description: { type: 'string' },
        points: { type: 'integer', minimum: 100, maximum: 500 },
        difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
        tags: { 
          type: 'array', 
          items: { type: 'string' }
        }
      },
      required: ['name', 'category', 'description', 'points']
    }
  }
});

export const generateHint = async (challengeName, challengeDescription) => {
  try {
    const prompt = `Generate a cryptic hint for this CTF challenge:
    
Name: ${challengeName}
Description: ${challengeDescription}

Provide a creative hint that guides players toward the right approach without spoiling the solution.`;

    const result = await hintModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating hint:', error);
    return 'Sometimes the path is hidden in plain sight...';
  }
};

export const generateChallengeIdea = async () => {
  try {
    const prompt = `Generate a creative and engaging CTF challenge idea. 
    The challenge should be unique, technically interesting, and suitable for a cybersecurity competition.
    Include a catchy name, clear category, detailed description, appropriate point value (100-500), difficulty level, and relevant tags.
    Make it challenging but solvable with proper technical knowledge.`;

    const result = await challengeModel.generateContent(prompt);
    const response = await result.response;
    const challengeData = JSON.parse(response.text());
    
    return challengeData;
  } catch (error) {
    console.error('Error generating challenge idea:', error);
    return {
      name: 'Digital Fortress',
      category: 'Crypto',
      description: 'A mysterious encrypted message has been discovered. Can you decode the secrets within?',
      points: 250,
      difficulty: 'Medium',
      tags: ['encryption', 'classical-cipher']
    };
  }
};

export default { generateHint, generateChallengeIdea };