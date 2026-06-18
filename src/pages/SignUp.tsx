import { useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";

export default function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)]">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Sign up</h1>

        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-3 py-2"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md px-3 py-2"
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-brand-navy)] text-white py-2 rounded-md disabled:opacity-60"
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
      </div>
    </div>
  );
}