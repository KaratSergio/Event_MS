import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface AssistantButtonProps {
  onClick: () => void;
}

export default function AssistantButton({ onClick }: AssistantButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg 
        hover:bg-green-700 transition-all hover:scale-110 z-50 group"
      aria-label="Open AI Assistant"
    >
      <ChatBubbleLeftIcon className="w-6 h-6" />
      <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-white 
        bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Ask AI Assistant
      </span>
    </button>
  );
}