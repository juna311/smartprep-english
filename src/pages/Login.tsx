import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { loginWithPassword } from "../services/auth";
import { getErrorMessage } from "../utils/errors";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState = location.state as
    | {
        from?: {
          pathname: string;
          search?: string;
          hash?: string;
        };
      }
    | undefined;
  const requestedLocation = locationState?.from;
  const destination = requestedLocation
    ? `${requestedLocation.pathname}${requestedLocation.search ?? ""}${requestedLocation.hash ?? ""}`
    : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithPassword(email, password);
      navigate(destination, { replace: true });
    } catch (error) {
      setError(getErrorMessage(error, "Could not log in. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Log in</h1>

        {error && (
          <p
            id="login-error"
            role="alert"
            className="text-red-600 text-sm mb-2"
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleLogin}
          aria-busy={loading}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="login-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "login-error" : undefined}
              className="border rounded-md px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="login-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "login-error" : undefined}
              className="border rounded-md px-3 py-2"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            size="form"
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-[var(--color-brand-navy)] font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
