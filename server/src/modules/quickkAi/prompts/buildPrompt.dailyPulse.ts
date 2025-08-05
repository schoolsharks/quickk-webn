import { DailyPulseData } from "../types/interfaces";

const buildDailyPulsePrompt = (pulseData: DailyPulseData): string => {
  const { pulseCount = 0, topic } = pulseData;

  // Calculate distribution (70% Questions, 30% InfoCards)
  const questionsCount = Math.ceil(pulseCount * 0.6);
  const infoCardsCount = pulseCount - questionsCount;

  let prompt = `You are an expert educational content creator. Generate daily pulse content for the topic: "${topic}".

IMPORTANT: Respond ONLY with valid JSON. No explanations, no markdown formatting, just pure JSON.

Generate:
1. ${infoCardsCount} InfoCards
2. ${questionsCount} Questions (TWO_CHOICE type only)

InfoCard Rules:
- title: Engaging title related to "${topic}"
- content: Detailed educational content (1 paragraphs less than 35 words.)
- wantFeedback: MUST always be true
- score: Optional positive number (10-50 range)

Question Rules:
- qType: MUST be "TWO_CHOICE"
- questionText: Clear question related to "${topic}" and word count less than 25.
- questionOptions: Array of exactly 2 options in format ["A-Option A", "B-Option B"]
- options: Array of exactly 2 letters ["A", "B"]
- optionType: MUST be "text"(this is very important field always put this)
- correctAnswer: Either "A" or "B"
- score: 10

Example InfoCard:
{
  "title": "Understanding Climate Change",
  "content": "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations are natural, human activities have been the main driver since the 1800s, primarily through burning fossil fuels like coal, oil and gas.\\n\\nThese activities release greenhouse gases into the atmosphere, which trap heat and cause global temperatures to rise. The effects include melting ice caps, rising sea levels, and extreme weather events that impact ecosystems and human communities worldwide.",
  "wantFeedback": true,
  "score": 25
}

Example Question:
{
  "qType": "TWO_CHOICE",
  "questionText": "What is the primary cause of current climate change?",
  "questionOptions": [
    "A-Human activities like burning fossil fuels",
    "B-Natural climate variations"
  ],
  "options": ["A", "B"],
  "optionType": "text",
  "correctAnswer": "A",
  "score": 10
}

Response Format:
{
  "infoCards": [
    {
      "title": "...",
      "content": "...",
      "wantFeedback": true,
      "score": 25
    }
  ],
  "questions": [
    {
      "qType": "TWO_CHOICE",
      "questionText": "...",
      "questionOptions": ["A-...", "B-..."],
      "options": ["A", "B"],
      "optionType": "text",
      "correctAnswer": "A",
      "score": 10
    }
  ]
}

Topic: "${topic}"
Make all content educational, accurate, and engaging for daily learning. Ensure proper JSON formatting.
Create ${infoCardsCount} info cards and ${questionsCount} questions.`;

  return prompt;
}

export default buildDailyPulsePrompt;