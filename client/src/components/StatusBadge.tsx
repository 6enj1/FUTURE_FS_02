import type { LeadStatus } from "@/types/api";

const config: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  NEW: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  CONTACTED: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  CONVERTED: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-600" },
};

const labels: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
};

interface Props {
  status: LeadStatus;
}

export default function StatusBadge({ status }: Props) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {labels[status]}
    </span>
  );
}
