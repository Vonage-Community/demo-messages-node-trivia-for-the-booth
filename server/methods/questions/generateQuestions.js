import OpenAI from 'openai';
import { createQuestionsBatch } from '../../../service/questions/createQuestion.js';
import { getAllQuestions } from '../../../service/questions/getAllQuestions.js';
import debug from './log.js';
const log = debug.extend('generate');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const seed = Math.random().toString(36).slice(2, 8);

const generateTriviaQuestions = async (
  gameId,
  count,
  themes,
  difficulty,
  usedQuestions,
) => {
  log('Generating questions from chatGPT');
  let prompt = `
You are a trivia question generator generating questions for Game ID ${gameId}.
Create ${count} trivia questions about the following themes:
${themes.join(', ')}

Random seed: ${seed}

Questions should be of difficulty ${difficulty}

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

Each question must be unique.
Vary question phrasing, the correct choice, and topics each time.
`;

  log('prompt', prompt);
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 1.0,
    top_p: 0.9,
  });

  const content = response.choices[0].message.content.trim();
  log('response', content);
  try {
    const questions = JSON.parse(content);
    log('questions from GPT', questions);
    return Array.isArray(questions) ? questions : [questions];
  } catch (err) {
    log('Failed to parse JSON:', err);
    log('Raw output:', content);
    return [];
  }
};

export const generateQuestionsMethod = async (args) => {
  log('Generating questions');
  const { gameId, themes, count, difficulty } = args;
  const usedQuestions = getAllQuestions(gameId).map(({ question }) => question);
  const questions = await generateTriviaQuestions(gameId, count, themes, difficulty, usedQuestions);
  return createQuestionsBatch(gameId, questions);
};

