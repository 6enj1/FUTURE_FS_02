import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { FollowUp } from "@/types/api";

export function useFollowUps(leadId: string) {
  return useQuery({
    queryKey: ["leads", leadId, "followups"],
    queryFn: () => api.get<FollowUp[]>(`/leads/${leadId}/followups`),
  });
}

export function useCreateFollowUp(leadId: string) {
  return useMutation({
    mutationFn: (data: { dueAt: string; note?: string }) =>
      api.post<FollowUp>(`/leads/${leadId}/followups`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", leadId] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}

export function useUpdateFollowUp(leadId: string) {
  return useMutation({
    mutationFn: ({
      followupId,
      ...data
    }: {
      followupId: string;
      dueAt?: string;
      note?: string | null;
      completedAt?: string | null;
    }) => api.patch<FollowUp>(`/followups/${followupId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", leadId] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },
  });
}
