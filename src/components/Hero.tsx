import { useNavigate } from "react-router-dom";
import Button from "./Button.tsx";
import heroImage from "../assets/newHero.png";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="
                relative isolate overflow-hidden
                min-h-[520px] md:min-h-[620px] xl:min-h-[680px]
                flex items-center
                bg-[linear-gradient(135deg,var(--color-brand-navy)_0%,var(--color-brand-navy-soft)_100%)]
            "
    >
      <img
        src={heroImage}
        alt="Abstract English learning path with learn, practice, and improve milestones"
        className="
                    absolute right-0 top-0 -z-30
                    hidden md:block
                    h-full w-auto max-w-none
                    object-contain object-right
                    opacity-82
                    [mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0)_8%,black_28%,black_100%)]
                    [-webkit-mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0)_8%,black_28%,black_100%)]
                "
      />

      <div
        className="
                    absolute inset-0 -z-20
                    bg-[linear-gradient(90deg,rgba(11,31,58,0.98)_0%,rgba(11,31,58,0.94)_42%,rgba(11,31,58,0.7)_64%,rgba(11,31,58,0.28)_100%)]
                    md:bg-[linear-gradient(90deg,rgba(11,31,58,0.98)_0%,rgba(11,31,58,0.94)_38%,rgba(11,31,58,0.68)_62%,rgba(11,31,58,0.22)_100%)]
                    xl:bg-[linear-gradient(90deg,rgba(11,31,58,0.98)_0%,rgba(11,31,58,0.92)_40%,rgba(11,31,58,0.58)_66%,rgba(11,31,58,0.16)_100%)]
                "
      />

      <div
        className="
                    absolute inset-0 -z-10
                    bg-[radial-gradient(circle_at_84%_14%,rgba(232,198,106,0.1)_0%,rgba(232,198,106,0.04)_24%,rgba(232,198,106,0)_46%)]
                "
      />

      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 md:px-8 xl:px-10 w-full">
        <div className="flex flex-col gap-5 max-w-[34rem] xl:max-w-[36rem]">
          <p
            className="
                            text-[var(--color-brand-gold-light)]
                            text-sm md:text-base
                            font-semibold tracking-[0.22em] uppercase
                        "
          >
            Learn English in a smart way
          </p>

          <h1
            className="
                            text-white text-5xl sm:text-6xl md:text-8xl xl:text-9xl
                            font-bold leading-[0.9]
                            tracking-[-0.055em]
                            font-[var(--font-display)]
                            [text-shadow:0_4px_18px_rgba(0,0,0,0.22)]
                        "
          >
            Eigo
            <span className="text-[var(--color-brand-gold-light)]">Path</span>
          </h1>

          <p
            className="
                            text-white/90 text-lg md:text-2xl xl:text-[1.65rem] text-left
                            max-w-xl leading-relaxed
                            [text-shadow:0_2px_8px_rgba(0,0,0,0.22)]
                        "
          >
            Build your English step by step with grammar lessons, vocabulary
            review, and your own smart dictionary.
          </p>

          <Button
            onClick={() => navigate("/dashboard")}
            variant="gold"
            className="
                            mt-4
                            text-base md:text-lg
                            hover:-translate-y-0.5 hover:shadow-md
                            transition-all duration-200
                            px-8 py-3 rounded-[var(--radius-md)]
                            font-semibold font-[var(--font-body)]
                            shadow-[var(--shadow-gold-soft)]
                            flex items-center justify-center
                            w-44 md:w-48
                        "
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
