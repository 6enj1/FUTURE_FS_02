import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLead, useUpdateLead, useDeleteLead } from "@/features/leads";
import { useCreateNote } from "@/features/notes";
import { useCreateFollowUp, useUpdateFollowUp } from "@/features/followups";
import type { LeadStatus, Note, FollowUp } from "@/types/api";
import StatusBadge from "@/components/StatusBadge";
import Spinner from "@/components/Spinner";
import ErrorMessage from "@/components/ErrorMessage";
import { formatDateTime, formatDate, isOverdue, isDueToday } from "@/lib/format";

const noteSchema = z.object({ body: z.string().min(1, "Required") });
type NoteForm = z.infer<typeof noteSchema>;

const followUpSchema = z.object({
  dueAt: z.string().min(1, "Pick a date"),
  note: z.string().optional(),
});
type FollowUpForm = z.infer<typeof followUpSchema>;

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading, isError, refetch } = useLead(id!);
  const updateLead = useUpdateLead(id!);
  const deleteLead = useDeleteLead(id!);
  const createNote = useCreateNote(id!);
  const createFollowUp = useCreateFollowUp(id!);
  const updateFollowUp = useUpdateFollowUp(id!);

  const noteForm = useForm<NoteForm>({ resolver: zodResolver(noteSchema) });
  const followUpForm = useForm<FollowUpForm>({ resolver: zodResolver(followUpSchema) });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage onRetry={() => refetch()} />;
  if (!lead) return null;

  const handleStatusChange = (status: LeadStatus) => {
    updateLead.mutate({ status });
  };

  const handleDelete = () => {
    if (window.confirm("Delete this lead? This cannot be undone.")) {
      deleteLead.mutate(undefined, {
        onSuccess: () => navigate("/leads", { replace: true }),
      });
    }
  };

  const onNoteSubmit = (data: NoteForm) => {
    createNote.mutate(data, { onSuccess: () => noteForm.reset() });
  };

  const onFollowUpSubmit = (data: FollowUpForm) => {
    createFollowUp.mutate(
      { dueAt: new Date(data.dueAt).toISOString(), note: data.note },
      { onSuccess: () => followUpForm.reset() }
    );
  };

  const handleComplete = (followupId: string) => {
    updateFollowUp.mutate({ followupId, completedAt: new Date().toISOString() });
  };

  const pending = lead.followUps.filter((f) => !f.completedAt);
  const completed = lead.followUps.filter((f) => f.completedAt);

  const activity = [
    ...lead.notes.map((n) => ({ kind: "note" as const, at: n.createdAt, item: n })),
    ...lead.followUps.map((f) => ({ kind: "followup" as const, at: f.createdAt, item: f })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <div>
      <Link
        to="/leads"
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        &larr; Back to leads
      </Link>

      {/* Header */}
      <div className="card p-5 mt-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                {lead.name}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">{lead.email}{lead.phone ? ` \u00B7 ${lead.phone}` : ""}</p>
              <div className="flex items-center gap-3 mt-2.5">
                <StatusBadge status={lead.status} />
                <span className="text-xs text-gray-400">{lead.source}</span>
                {lead.lastContactedAt && (
                  <span className="text-[11px] text-gray-300">
                    Last contacted {formatDate(lead.lastContactedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              aria-label="Update status"
              className="input h-8 w-auto text-xs"
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="CONVERTED">Converted</option>
            </select>
            <button onClick={handleDelete} className="btn-outline btn-sm text-red-500 hover:text-red-600 hover:border-red-300">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Notes</h2>
            <span className="text-xs text-gray-300">{lead.notes.length}</span>
          </div>

          <form onSubmit={noteForm.handleSubmit(onNoteSubmit)} className="card p-4 mb-4">
            <textarea
              placeholder="Write a note..."
              rows={3}
              className="input resize-none"
              {...noteForm.register("body")}
            />
            {noteForm.formState.errors.body && (
              <p className="mt-1 text-[11px] text-red-500">{noteForm.formState.errors.body.message}</p>
            )}
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={createNote.isPending} className="btn-dark text-xs h-7 px-3">
                {createNote.isPending ? "Saving..." : "Add note"}
              </button>
            </div>
          </form>

          {lead.notes.length === 0 ? (
            <p className="text-xs text-gray-300 py-8 text-center">No notes yet.</p>
          ) : (
            <div className="space-y-2">
              {lead.notes.map((note: Note) => (
                <div key={note.id} className="card p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {note.body}
                  </p>
                  <p className="text-[11px] text-gray-300 mt-2">
                    {formatDateTime(note.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Follow-ups */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">Follow-ups</h2>
            <span className="text-xs text-gray-300">{lead.followUps.length}</span>
          </div>

          <form onSubmit={followUpForm.handleSubmit(onFollowUpSubmit)} className="card p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="followup-date" className="label">Due date</label>
                <input id="followup-date" type="datetime-local" className="input" {...followUpForm.register("dueAt")} />
              </div>
              <div>
                <label htmlFor="followup-note" className="label">Note</label>
                <input id="followup-note" className="input" placeholder="Optional" {...followUpForm.register("note")} />
              </div>
            </div>
            {followUpForm.formState.errors.dueAt && (
              <p className="mt-1 text-[11px] text-red-500">{followUpForm.formState.errors.dueAt.message}</p>
            )}
            <div className="flex justify-end mt-2">
              <button type="submit" disabled={createFollowUp.isPending} className="btn-dark text-xs h-7 px-3">
                {createFollowUp.isPending ? "Adding..." : "Schedule"}
              </button>
            </div>
          </form>

          {/* Upcoming */}
          {pending.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Upcoming</p>
              <div className="space-y-1.5">
                {pending.map((fu: FollowUp) => {
                  const overdue = isOverdue(fu.dueAt);
                  const today = isDueToday(fu.dueAt);
                  return (
                    <div
                      key={fu.id}
                      className={`rounded-lg px-3.5 py-3 flex items-start justify-between gap-3 ${
                        overdue
                          ? "bg-red-50 border border-red-100"
                          : today
                          ? "bg-amber-50 border border-amber-100"
                          : "bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium tabular-nums ${overdue ? "text-red-700" : "text-gray-800"}`}>
                            {formatDate(fu.dueAt)}
                          </span>
                          {overdue && (
                            <span className="px-1.5 py-px rounded bg-red-100 text-[10px] font-bold text-red-600 uppercase">overdue</span>
                          )}
                          {today && !overdue && (
                            <span className="px-1.5 py-px rounded bg-amber-100 text-[10px] font-bold text-amber-700 uppercase">today</span>
                          )}
                        </div>
                        {fu.note && <p className="text-xs text-gray-500 mt-1">{fu.note}</p>}
                      </div>
                      <button
                        onClick={() => handleComplete(fu.id)}
                        className="shrink-0 text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">Completed</p>
              <div className="space-y-1.5">
                {completed.map((fu: FollowUp) => (
                  <div key={fu.id} className="rounded-lg px-3.5 py-2.5 bg-gray-50/50 opacity-50">
                    <p className="text-xs text-gray-500 line-through tabular-nums">{formatDate(fu.dueAt)}</p>
                    {fu.note && <p className="text-[11px] text-gray-400 mt-0.5">{fu.note}</p>}
                    <p className="text-[10px] text-gray-300 mt-0.5">Completed {formatDateTime(fu.completedAt!)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lead.followUps.length === 0 && (
            <p className="text-xs text-gray-300 py-8 text-center">No follow-ups yet.</p>
          )}
        </section>
      </div>

      {/* Activity */}
      {activity.length > 0 && (
        <section className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Activity</h2>
          <div className="space-y-0">
            {activity.map((a, i) => (
              <div
                key={`${a.kind}-${a.item.id}`}
                className={`flex gap-4 py-3 ${i > 0 ? "border-t border-gray-50" : ""}`}
              >
                <div className="w-[100px] shrink-0 text-[11px] text-gray-300 tabular-nums pt-0.5">
                  {formatDateTime(a.at)}
                </div>
                <div className="flex items-start gap-2 min-w-0">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    a.kind === "note" ? "bg-sky-400" : "bg-violet-400"
                  }`} />
                  <div className="min-w-0">
                    <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                      {a.kind === "note" ? "Note" : "Follow-up"}
                    </span>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {a.kind === "note"
                        ? (a.item as Note).body
                        : (a.item as FollowUp).note || `Scheduled for ${formatDate((a.item as FollowUp).dueAt)}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
