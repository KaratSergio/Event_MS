import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useAssistant } from '../../services/hooks/useAssistant';
import { useAuth } from '../../services/hooks/useAuth';
import AssistantMessage from './AssistantMessage';
import { SUGGESTED_QUESTIONS } from '../../services/assistant/assistant.types';
import LoadingState from '../ui/LoadingState';
import { useNavigate } from 'react-router-dom';

interface AssistantPanelProps {
  onClose: () => void;
}

export default function AssistantPanel({ onClose }: AssistantPanelProps) {
  const { messages, isLoading, sendMessage } = useAssistant();
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading || !user) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (!user) return;
    sendMessage(question);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50 max-h-150">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-green-600 text-white rounded-t-lg shrink-0">
        <div className="flex items-center space-x-2">
          <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />
          <h3 className="font-semibold">Event Assistant</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-green-700 rounded transition-colors"
          aria-label="Close assistant"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 min-h-75 max-h-100">
        {!user ? (
          <div className="text-center text-gray-500 mt-8">
            <ChatBubbleOvalLeftEllipsisIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mb-2">
              Sign in to use Assistant
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Get personalized help with your events, ask questions, and manage your schedule
            </p>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium
                hover:bg-green-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            <p className="text-sm mb-4">Ask me anything about your events!</p>

            {/* Suggested questions */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400">Try asking:</p>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="w-full text-left text-xs p-2 bg-white rounded-lg border border-gray-200 
                    hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <AssistantMessage key={msg.id} message={msg} />
            ))}
          </>
        )}

        {/* Loading indicator */}
        {isLoading && user && (
          <div className="flex justify-start">
            <LoadingState
              message="Assistant is thinking..."
              size="sm"
              className="bg-gray-100 p-3 rounded-lg rounded-bl-none"
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white rounded-b-lg shrink-0">
        {user ? (
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none 
                focus:ring-2 focus:ring-green-500 bg-gray-50"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium
                hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors"
            >
              Send
            </button>
          </div>
        ) : (
          <div className="text-center text-xs text-gray-400 py-2 border border-gray-200 rounded-lg bg-gray-50">
            Please sign in to send messages
          </div>
        )}
      </div>
    </div>
  );
}