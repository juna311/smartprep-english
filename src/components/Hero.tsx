import { useNavigate } from 'react-router-dom'
import Button from './Button.tsx'
import heroImage from '../assets/hero.png'


export default function Hero() {
    const navigate = useNavigate()

    return (
        <section className="
                    flex justify-between items-center
                    bg-[linear-gradient(135deg,var(--color-brand-navy)_0%,var(--color-brand-navy-soft)_58%,var(--color-brand-gold)_145%)]
                    relative overflow-visible
                    py-12 md:py-20 lg:py-24">
            <div className="
                    max-w-6xl mx-auto px-6 md:px-8 flex items-center w-full">
                <div className="
                    flex flex-col gap-5 max-w-xl">

                    <p className="
                    text-[var(--color-brand-gold-light)] text-sm md:text-base
                    font-semibold tracking-[0.18em] uppercase
                    ">Learn English in a smart way</p>

                    <h1 className="
                    text-white text-5xl
                    md:text-7xl font-bold leading-[0.95]
                    tracking-[-0.04em]
                    font-[var(--font-display)]
                    [text-shadow:0_2px_8px_rgba(0,0,0,0.24)]
                    ">EigoPath</h1>

                    <p className="
                    text-white/88 text-lg md:text-xl text-left
                    max-w-xl leading-relaxed
                    [text-shadow:0_1px_4px_rgba(0,0,0,0.22)]
                    ">Build your English step by step with grammar lessons, vocabulary review, and your own smart dictionary.</p>

                    <Button
                    onClick={() => navigate('/dashboard')}
                    className="
                    bg-[var(--color-brand-gold)]
                    text-[var(--color-brand-navy)] text-base md:text-lg
                    hover:bg-[var(--color-brand-gold-light)]
                    hover:-translate-y-0.5 hover:shadow-md
                    transition-all duration-200
                    px-5 py-3 rounded-[var(--radius-md)]
                    font-semibold font-[var(--font-body)]
                    shadow-[var(--shadow-gold-soft)]
                    flex items-center justify-center
                    w-40 md:w-48
                    ">Get Started</Button>

                </div>
                <img
                    src={heroImage}
                    alt="EigoPath English learning app preview"
                    className="
                    hidden
                    md:block
                    absolute md:right-[3rem] right-0 bottom-[-2rem]
                    w-[clamp(17rem,30vw,23rem)] h-[clamp(17rem,30vw,23rem)]
                    object-cover rounded-[var(--radius-xl)]
                    shadow-[0_0_35px_rgba(0,0,0,0.35)]
                    border border-white/20"
                />
            </div>
        </section>
    )
}