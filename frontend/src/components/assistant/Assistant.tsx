import { useAssistant } from '../../services/hooks/useAssistant';
import AssistantButton from './AssistantButton';
import AssistantPanel from './AssistantPanel';

export default function Assistant() {
  const { isOpen, setIsOpen } = useAssistant();

  return (
    <>
      {!isOpen && <AssistantButton onClick={() => setIsOpen(true)} />}
      {isOpen && <AssistantPanel onClose={() => setIsOpen(false)} />}
    </>
  );
}