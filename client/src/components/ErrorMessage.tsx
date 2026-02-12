interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message = "Something went wrong.", onRetry }: Props) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm text-gray-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
