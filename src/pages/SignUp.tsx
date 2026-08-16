import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import { signUpWithPassword } from "../services/auth";
import { getErrorMessage } from "../utils/errors";

export default function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(
    null,
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signUpWithPassword(email, password);

      if (result.requiresEmailConfirmation) {
        setConfirmationEmail(email);
        return;
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Could not create your account. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        {confirmationEmail ? (
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-brand-navy)]">
              Account created
            </p>
            <h1 className="mt-2 text-2xl font-bold">Check your email</h1>
            <p role="status" className="mt-3 text-gray-700">
              We sent a confirmation link to{" "}
              <strong>{confirmationEmail}</strong>. Open that link before
              logging in.
            </p>
            <Link
              to="/login"
              className="mt-5 inline-block font-medium text-[var(--color-brand-navy)] hover:underline"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Sign up</h1>

            {error && (
              <p
                id="signup-error"
                role="alert"
                className="text-red-600 text-sm mb-2"
              >
                {error}
              </p>
            )}

            <form
              onSubmit={handleSignup}
              aria-busy={loading}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "signup-error" : undefined}
                  className="border rounded-md px-3 py-2"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="signup-password"
                  className="text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  aria-invalid={Boolean(error)}
                  aria-describedby={
                    error
                      ? "signup-password-help signup-error"
                      : "signup-password-help"
                  }
                  className="border rounded-md px-3 py-2"
                  required
                />
                <p id="signup-password-help" className="text-xs text-gray-600">
                  Use at least 6 characters.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                size="form"
              >
                {loading ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[var(--color-brand-navy)] font-medium hover:underline"
              >
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
