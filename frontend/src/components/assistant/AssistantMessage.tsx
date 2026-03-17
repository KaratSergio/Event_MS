import ReactMarkdown from 'react-markdown';
import type { AssistantMessage as Message } from '../../services/assistant/assistant.types';
import type { Components } from 'react-markdown';

interface AssistantMessageProps {
  message: Message;
}

export default function AssistantMessage({ message }: AssistantMessageProps) {
  const isUser = message.role === 'user';

  const components: Components = {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    ul: ({ children }) => <ul className="list-disc pl-5 my-1 space-y-0.5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-5 my-1 space-y-0.5">{children}</ol>,
    li: ({ children }) => <li className="leading-5">{children}</li>,
    p: ({ children }) => <p className="my-1">{children}</p>,
    h1: ({ children }) => <h1 className="text-lg font-bold my-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-base font-bold my-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-sm font-bold my-1">{children}</h3>,
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg text-sm wrap-break-word ${isUser
          ? 'bg-green-600 text-white rounded-br-none'
          : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
        ) : (
          <ReactMarkdown components={components}>
            {message.content}
          </ReactMarkdown>
        )}
        <span className={`text-[10px] mt-1 block ${isUser ? 'text-green-100' : 'text-gray-500'
          }`}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}