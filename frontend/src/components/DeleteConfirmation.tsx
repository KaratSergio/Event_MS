import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteConfirmationProps {
  eventTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmation({
  eventTitle,
  onConfirm,
  onCancel,
  isDeleting = false
}: DeleteConfirmationProps) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
        <TrashIcon className="w-6 h-6 text-red-600" />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Event</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete <span className="font-medium text-gray-900">"{eventTitle}"</span>?
        This action cannot be undone.
      </p>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="w-full sm:w-auto px-4 py-2.5 border border-gray-300 rounded-lg
            text-gray-700 font-medium hover:bg-gray-50 transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium
            hover:bg-red-700 transition-colors disabled:opacity-50
            disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isDeleting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Deleting...
            </>
          ) : (
            'Delete Event'
          )}
        </button>
      </div>
    </div>
  );
}