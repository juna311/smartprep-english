import { useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { Link } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
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
        <h1 className="text-2xl font-bold mb-4">Log in</h1>

        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md px-3 py-2"
          />

          <Button
            type="submit"
            disabled={loading}
            className="bg-[var(--color-brand-blue)] text-white py-2 rounded-md disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link
                to="/signup"
                className="text-[var(--color-brand-blue)] font-medium hover:underline"
            >
                Sign up
            </Link>
        </p>
      </div>
    </div>
  );
}