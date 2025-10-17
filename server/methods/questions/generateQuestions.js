import OpenAI from 'openai';
import dotenv from 'dotenv';
import { createQuestion, createQuestionsBatch } from '../../../service/questions.js';
import debug from './log.js';
dotenv.config();
const log = debug.extend('generate');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTriviaQuestions = async (count, themes) => {
  log('Generating questions from chatGPT');
  const prompt = `
You are a trivia question generator. Create ${count} trivia questions about the following themes:
${themes.join(', ')}

Each question should:
- Be factually accurate and concise.
- Include 4 multiple choice answers (A–D).
- Clearly indicate which choice is correct.
- Be in JSON format with this structure:

{
  "question": "string",
  "choiceA": "string",
  "choiceB": "string",
  "choiceC": "string",
  "choiceD": "string",
  "correctChoice": "A"
}

Return only valid JSON — no explanations, markdown, or commentary.
`;

  log('prompt', prompt);
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content.trim();
  log('response', content);
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error('Failed to parse JSON:', err);
    console.log('Raw output:', content);
    return [];
  }
};

export const generateQuestionsMethod = async (args) => {
  log('Generating questions');
  const { gameId, themes, count } = args;
  const questions = await generateTriviaQuestions(count, themes);
  //  console.log(questions);
  return createQuestionsBatch(gameId, questions);
};

