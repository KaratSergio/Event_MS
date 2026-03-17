import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';
import type { AskQuestionDto, AssistantResponse } from './assistant.types';

export const assistantApi = {
  askQuestion: (data: AskQuestionDto) =>
    apiClient.post<AssistantResponse>(API_ENDPOINTS.ASSISTANT.ASK, data),
};