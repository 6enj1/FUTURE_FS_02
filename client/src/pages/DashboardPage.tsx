import { Link } from "react-router-dom";
import { useMetrics } from "@/features/metrics";
import Spinner from "@/components/Spinner";
import ErrorMessage from "@/components/ErrorMessage";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useMetrics();

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage onRetry={() => refetch()} />;
  if (!data) return null;

  const pipeline = [
    { label: "New", value: data.newLeads, total: data.totalLeads, color: "bg-sky-500" },
    { label: "Contacted", value: data.contactedLeads, total: data.totalLeads, color: "bg-amber-500" },
    { label: "Converted", value: data.convertedLeads, total: data.totalLeads, color: "bg-teal-500" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
          Overview
        </h1>
        <Link to="/leads" className="btn-outline text-xs h-8 px-3">
          View all leads
        </Link>
      </div>

      {/* Total */}
      <div className="card p-6 mb-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total leads</p>
            <p className="text-4xl font-bold text-gray-900 tracking-tight mt-1 tabular-nums">
              {data.totalLeads}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-teal-600 tabular-nums">{data.conversionRate}%</p>
            <p className="text-xs text-gray-400 mt-0.5">conversion</p>
          </div>
        </div>

        {/* Pipeline bar */}
        <div className="flex rounded-full h-2 overflow-hidden bg-gray-100 mt-5">
          {pipeline.map((s) => (
            <div
              key={s.label}
              className={`${s.color} transition-all duration-500`}
              style={{ width: s.total > 0 ? `${(s.value / s.total) * 100}%` : "0%" }}
            />
          ))}
        </div>
        <div className="flex gap-5 mt-3">
          {pipeline.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${s.color}`} />
              <span className="text-xs text-gray-500">
                {s.label} <span className="font-semibold text-gray-700 tabular-nums">{s.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`card p-5 ${data.overdueFollowUpsCount > 0 ? "border-red-200 bg-red-50/30" : ""}`}>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Overdue follow-ups
          </p>
          <p className={`text-3xl font-bold tracking-tight mt-1 tabular-nums ${
            data.overdueFollowUpsCount > 0 ? "text-red-600" : "text-gray-900"
          }`}>
            {data.overdueFollowUpsCount}
          </p>
          {data.overdueFollowUpsCount > 0 && (
            <Link to="/leads?status=CONTACTED" className="inline-block mt-3 text-xs text-red-600 font-medium hover:underline">
              Review now
            </Link>
          )}
        </div>

        <div className={`card p-5 ${data.followUpsDueTodayCount > 0 ? "border-amber-200 bg-amber-50/30" : ""}`}>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Due today
          </p>
          <p className={`text-3xl font-bold tracking-tight mt-1 tabular-nums ${
            data.followUpsDueTodayCount > 0 ? "text-amber-600" : "text-gray-900"
          }`}>
            {data.followUpsDueTodayCount}
          </p>
          {data.followUpsDueTodayCount > 0 && (
            <p className="mt-3 text-xs text-amber-600 font-medium">Scheduled for today</p>
          )}
        </div>
      </div>
    </div>
  );
}
