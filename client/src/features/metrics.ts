import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MetricsSummary } from "@/types/api";

export function useMetrics() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: () => api.get<MetricsSummary>("/metrics/summary"),
  });
}
