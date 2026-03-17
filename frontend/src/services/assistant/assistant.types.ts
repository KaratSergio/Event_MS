export interface AssistantMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
}

export interface AskQuestionDto {
  question: string;
}

export interface AssistantResponse {
  answer: string;
}

export const SUGGESTED_QUESTIONS = [
  'What events am I attending this week?',
  'When is my next event?',
  'List all events I organize.',
  'Show public tech events this weekend.',
  'Who’s attending the Tech Conference?',
  'Where is the Food Festival?',
  'How many events do I have?',
  'What events happened last week?',
] as const;