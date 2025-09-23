interface EventDescriptionData {
    originalDescription: string;
    eventTitle: string;
    eventType: 'ONLINE' | 'OFFLINE';
}

const buildEventDescriptionPrompt = (data: EventDescriptionData): string => {
    const { originalDescription, eventTitle, eventType } = data;

    const prompt = `You are an expert event marketing copywriter. Your task is to improve the given event description to make it more engaging, professional, and compelling while maintaining all the original information and meaning.

IMPORTANT: Respond ONLY with the improved description text. No explanations, no markdown formatting, no quotes, just the improved description.

Original Event Details:
- Title: "${eventTitle}"
- Type: ${eventType}
- Current Description: "${originalDescription}"

Guidelines for improvement:
1. Keep the core message and all important details intact
2. Make the language more engaging and professional
3. Add enthusiasm and excitement without being overly promotional
4. Maintain appropriate tone for the event type (${eventType.toLowerCase()})
5. Use compelling language that encourages participation
6. Keep the length between 300-500 characters
7. Ensure proper grammar and flow
8. Make it sound more polished and professional
9. Add call-to-action elements naturally if appropriate
10. Keep the original formatting style if it works well

The improved description should:
- Sound more professional and engaging
- Maintain all original key information
- Be compelling enough to attract attendees
- Have better flow and readability
- Include power words that create excitement
- Be appropriate for the target audience

Remember: Only return the improved description text, nothing else.`;

    return prompt;
};

export default buildEventDescriptionPrompt;