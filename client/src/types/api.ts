export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  status: LeadStatus;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
  nextFollowUp?: FollowUp | null;
  _count?: { notes: number; followUps: number };
}

export interface LeadDetail extends Lead {
  notes: Note[];
  followUps: FollowUp[];
}

export interface Note {
  id: string;
  leadId: string;
  body: string;
  createdAt: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  dueAt: string;
  note: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface MetricsSummary {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  conversionRate: number;
  overdueFollowUpsCount: number;
  followUpsDueTodayCount: number;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
