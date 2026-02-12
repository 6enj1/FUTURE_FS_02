import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin } from "@/features/auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    login.mutate(data, {
      onSuccess: () => navigate("/dashboard", { replace: true }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page px-4">
      <div className="w-full max-w-[360px]">
        <div className="flex items-center gap-2 mb-10">
          <span className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
            <span className="text-xs font-bold text-white">L</span>
          </span>
          <span className="text-sm font-semibold text-gray-900 tracking-tight">
            Leads
          </span>
        </div>

        <div className="card p-6">
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            Sign in
          </h1>
          <p className="text-sm text-gray-400 mt-1 mb-6">
            Enter your credentials to continue.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="input"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {login.isError && (
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2.5">
                <p className="text-xs text-red-600 font-medium">Invalid email or password.</p>
              </div>
            )}

            <button type="submit" disabled={login.isPending} className="btn-dark w-full">
              {login.isPending ? "Signing in..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
