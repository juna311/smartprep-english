import { Link } from "react-router-dom";
import FooterLogo from "../assets/footerLogo.png";

const learnLinks = [
  { label: "Grammar", to: "/grammar" },
  { label: "Vocabulary", to: "/vocabulary" },
  { label: "Practice", to: "/practice" },
];

const accountLinks = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Login", to: "/login" },
  { label: "Sign up", to: "/signup" },
];

export default function Footer() {
  return (
    <footer className="flex-none bg-[var(--color-brand-navy)] text-white">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 md:py-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <section>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="Go to homepage"
            >
              <img
                src={FooterLogo}
                alt="EigoPath logo"
                className="h-14 w-14 rounded-2xl object-contain bg-white p-1"
              />
              <div>
                <p className="text-xl font-bold">EigoPath</p>
                <p className="text-sm text-white/75">
                  Learn. Save. Review. Improve.
                </p>
              </div>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">
              A simple path for learning, saving, and reviewing English.
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">
              Learn
            </h2>
            <nav
              className="mt-4 flex flex-col gap-2"
              aria-label="Footer learn navigation"
            >
              {learnLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-white/85 transition hover:text-[var(--color-brand-gold)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70">
              Account
            </h2>
            <nav
              className="mt-4 flex flex-col gap-2"
              aria-label="Footer account navigation"
            >
              {accountLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-white/85 transition hover:text-[var(--color-brand-gold)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </section>
        </div>

        <div className="mt-8 border-t border-white/15 pt-5 text-sm text-white/65">
          © {new Date().getFullYear()} EigoPath. Built for steady English
          learning.
        </div>
      </div>
    </footer>
  );
}
