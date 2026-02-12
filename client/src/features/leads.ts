import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { Lead, LeadDetail, LeadStatus, PaginatedResponse } from "@/types/api";

interface ListLeadsParams {
  search?: string;
  status?: LeadStatus | "";
  source?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

function buildQuery(params: ListLeadsParams): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

export function useLeads(params: ListLeadsParams) {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () =>
      api.get<PaginatedResponse<Lead>>(`/leads?${buildQuery(params)}`),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => api.get<LeadDetail>(`/leads/${id}`),
  });
}

export function useCreateLead() {
  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      phone?: string;
      source?: string;
    }) => api.post<Lead>("/leads", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useUpdateLead(id: string) {
  return useMutation({
    mutationFn: (data: Partial<{
      name: string;
      email: string;
      phone: string | null;
      source: string;
      status: LeadStatus;
    }>) => api.patch<Lead>(`/leads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useDeleteLead(id: string) {
  return useMutation({
    mutationFn: () => api.delete(`/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}
