import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLeads, useCreateLead } from "@/features/leads";
import type { LeadStatus, Lead } from "@/types/api";
import StatusBadge from "@/components/StatusBadge";
import Spinner from "@/components/Spinner";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import { formatDate, isOverdue } from "@/lib/format";

const createSchema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Invalid"),
  phone: z.string().optional(),
  source: z.string().optional(),
});

type CreateForm = z.infer<typeof createSchema>;

export default function LeadsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError, refetch } = useLeads({
    search: search || undefined,
    status: statusFilter || undefined,
    page,
    pageSize: 20,
  });

  const createLead = useCreateLead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
  });

  const onCreateSubmit = (formData: CreateForm) => {
    createLead.mutate(formData, {
      onSuccess: () => { setShowCreate(false); reset(); },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Leads</h1>
          {data && (
            <p className="text-xs text-gray-400 mt-0.5">{data.total} total</p>
          )}
        </div>
        <button
          onClick={() => { setShowCreate(!showCreate); if (showCreate) reset(); }}
          className={showCreate ? "btn-outline text-xs h-8 px-3" : "btn-dark text-xs h-8 px-3"}
        >
          {showCreate ? "Cancel" : "+ New lead"}
        </button>
      </div>

      {/* Create */}
      {showCreate && (
        <div className="card p-5 mb-5">
          <p className="text-sm font-medium text-gray-900 mb-3">Add a new lead</p>
          <form onSubmit={handleSubmit(onCreateSubmit)}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label htmlFor="name" className="label">Name</label>
                <input id="name" className="input" placeholder="Jane Smith" {...register("name")} />
                {errors.name && <p className="mt-0.5 text-[11px] text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="create-email" className="label">Email</label>
                <input id="create-email" type="email" className="input" placeholder="jane@co.com" {...register("email")} />
                {errors.email && <p className="mt-0.5 text-[11px] text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="label">Phone</label>
                <input id="phone" className="input" placeholder="Optional" {...register("phone")} />
              </div>
              <div>
                <label htmlFor="source" className="label">Source</label>
                <input id="source" className="input" placeholder="e.g. Referral" {...register("source")} />
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              {createLead.isError
                ? <p className="text-xs text-red-500">{createLead.error.message}</p>
                : <div />
              }
              <button type="submit" disabled={createLead.isPending} className="btn-dark text-xs h-8 px-4">
                {createLead.isPending ? "Creating..." : "Create lead"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <input
          type="search"
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as LeadStatus | ""); setPage(1); }}
          aria-label="Filter by status"
          className="input w-auto"
        >
          <option value="">All statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CONVERTED">Converted</option>
        </select>
      </div>

      {isLoading && <Spinner />}
      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {data && data.items.length === 0 && (
        <div className="card">
          <EmptyState message={search || statusFilter ? "No leads match your filters." : "No leads yet. Add one to get started."} />
        </div>
      )}

      {data && data.items.length > 0 && (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Name</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Source</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Status</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Next follow-up</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Added</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((lead, i) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    last={i === data.items.length - 1}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-gray-400 tabular-nums">
                {(data.page - 1) * data.pageSize + 1}&ndash;{Math.min(data.page * data.pageSize, data.total)} of {data.total}
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-outline btn-sm"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.totalPages}
                  className="btn-outline btn-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function LeadRow({ lead, last, onClick }: { lead: Lead; last: boolean; onClick: () => void }) {
  const next = lead.nextFollowUp;

  return (
    <tr
      onClick={onClick}
      className={`group cursor-pointer transition-colors hover:bg-teal-50/30 ${last ? "" : "border-b border-gray-50"}`}
    >
      <td className="px-4 py-3">
        <p className="font-medium text-gray-900 group-hover:text-teal-700 transition-colors">
          {lead.name}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{lead.email}</p>
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs">{lead.source}</td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <StatusBadge status={lead.status} />
      </td>
      <td className="px-4 py-3">
        {next ? (
          <div>
            <span className={`text-xs tabular-nums ${isOverdue(next.dueAt) ? "text-red-600 font-semibold" : "text-gray-500"}`}>
              {formatDate(next.dueAt)}
            </span>
            {isOverdue(next.dueAt) && (
              <span className="ml-1.5 text-[10px] font-bold text-red-500 uppercase">overdue</span>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-300">&mdash;</span>
        )}
      </td>
      <td className="px-4 py-3 text-xs text-gray-400 tabular-nums">
        {formatDate(lead.createdAt)}
      </td>
    </tr>
  );
}
