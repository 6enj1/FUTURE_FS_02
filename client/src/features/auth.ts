import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { setToken, clearToken } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import type { User } from "@/types/api";

interface LoginResponse {
  token: string;
  user: User;
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      api.post<LoginResponse>("/auth/login", data),
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api.get<User>("/auth/me"),
    retry: false,
  });
}

export function logout() {
  clearToken();
  queryClient.clear();
  window.location.href = "/login";
}
