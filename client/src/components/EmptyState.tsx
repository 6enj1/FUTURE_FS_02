interface Props {
  message: string;
  sub?: string;
}

export default function EmptyState({ message, sub }: Props) {
  return (
    <div className="py-16 text-center">
      <p className="text-sm text-gray-500">{message}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}
