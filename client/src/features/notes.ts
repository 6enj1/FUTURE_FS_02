import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { Note } from "@/types/api";

export function useNotes(leadId: string) {
  return useQuery({
    queryKey: ["leads", leadId, "notes"],
    queryFn: () => api.get<Note[]>(`/leads/${leadId}/notes`),
  });
}

export function useCreateNote(leadId: string) {
  return useMutation({
    mutationFn: (data: { body: string }) =>
      api.post<Note>(`/leads/${leadId}/notes`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads", leadId] });
    },
  });
}
