import { ModuleType } from "../../learning/types/enums";
import { ModuleData } from "../types/interfaces";

const buildPrompt = (moduleData: ModuleData): string => {
    const { type, title, questionsCount = 0, assessmentCount = 0 } = moduleData;

    let prompt = `You are an expert educational content creator. Generate educational content for the topic: "${title}".

IMPORTANT: Respond ONLY with valid JSON. No explanations, no markdown formatting, just pure JSON.

`;

    if (type === ModuleType.VIDEO) {
        prompt += `Generate:
1. A YouTube embedded URL related to "${title}" (educational/training video)
2. ${assessmentCount} assessment questions

Video URL should be in format: CYRsxXqCVxQ
Video URL should be emebeded id of youtube video link.

`;
    } else {
        prompt += `Generate:
1. ${questionsCount} content questions (TWO_CHOICE type only)
2. ${assessmentCount} assessment questions

`;
    }

    prompt += `Content Questions Rules (only for question type modules):
- qType: MUST be "TWO_CHOICE"
- optionType: MUST be "correct-incorrect"
- options: MUST be ["right", "wrong"]
- Include questionSubText (introduction/context)
- Include questionSubHeading (main heading)
- questionText: Main educational content/statement
- correctAnswer: Either "right" or "wrong"
- score: 10
- explanation: Detailed HTML explanation with examples

Assessment Questions Rules:
- Distribution: 70% MULTIPLE_CHOICE, 20% DRAG_ORDER, 10% MEMORY_MATCH
- At least one question of each type if count >= 3
- score: 10 for all questions

MULTIPLE_CHOICE:
- qType: "MULTIPLE_CHOICE"
- optionType: "mcq"
- options: Array of 4 choices
- correctAnswer: Single correct option (exact text)
- explanation: Detailed explanation

DRAG_ORDER:
- qType: "DRAG_ORDER"
- optionType: "drag-order"
- questionSubHeading: Context heading
- questionText: "Drag to arrange the sentences in the correct order"
- options: Array of items to order (with prefixes like A), B), etc.)
- correctAnswer: Array in correct order
- explanation: HTML ordered list explanation

MEMORY_MATCH:
- qType: "MEMORY_MATCH"
- questionText: "Find the pairs."
- memoryPairs: Array of pair objects with id, content, matchId, type
- correctAnswer: Array of all pair IDs
- Each pair needs matching matchId values

example of memory match question:
{
  "qType": "MEMORY_MATCH",
  "id": "memory-q1",
  "questionText": "Find the pairs.",
  "memoryPairs": [
    {
      "id": "def-quid-pro-quo",
      "content": "When someone in power (like a boss or manager) asks for sexual favors in exchange for job benefits (promotion, salary hike, or even keeping the job).",
      "matchId": "quid-pro-quo",
      "type": "text"
    },
    {
      "id": "term-quid-pro-quo",
      "content": "Quid Pro Quo Harassment",
      "matchId": "quid-pro-quo",
      "type": "text"
    },
    {
      "id": "def-hostile-workplace",
      "content": "Unwelcome conduct based on sex or gender that is severe or pervasive enough to create a hostile or offensive work environment.",
      "matchId": "hostile-workplace",
      "type": "text"
    },
    {
      "id": "term-hostile-workplace",
      "content": "Hostile Work Environment",
      "matchId": "hostile-workplace",
      "type": "text"
    },
    {
      "id": "def-verbal-harassment",
      "content": "Offensive or sexually suggestive comments, jokes, or threats that create discomfort.",
      "matchId": "verbal-harassment",
      "type": "text"
    },
    {
      "id": "term-verbal-harassment",
      "content": "Verbal Harassment",
      "matchId": "verbal-harassment",
      "type": "text"
    },
    {
      "id": "def-nonverbal-harassment",
      "content": "Leering, gestures, or displaying sexually explicit images that make others uncomfortable.",
      "matchId": "nonverbal-harassment",
      "type": "text"
    },
    {
      "id": "term-nonverbal-harassment",
      "content": "Non-verbal Harassment",
      "matchId": "nonverbal-harassment",
      "type": "text"
    }
  ],
  "correctAnswer": [
    "def-quid-pro-quo",
    "term-quid-pro-quo",
    "def-hostile-workplace",
    "term-hostile-workplace",
    "def-verbal-harassment",
    "term-verbal-harassment",
    "def-nonverbal-harassment",
    "term-nonverbal-harassment"
  ],
  "score": 10
}

Response Format:
{
  ${type === ModuleType.VIDEO ? '"videoUrl": "CYRsxXqCVxQ",' : '"contentQuestions": [...],'} 
  "assessmentQuestions": [...]
}

Topic: "${title}"
Make all content educational, accurate, and engaging. Ensure proper JSON formatting.`;

    return prompt;
}


export default buildPrompt;