import Button from './Button.tsx'
import heroImage from '../assets/hero.png'


export default function Hero() {
    return (
        <section className="
                    flex justify-between items-center
                    bg-gradient-to-r from-[var(--color-brand-pink)] to-[#FF94C3] 
                    relative overflow-visible 
                    py-12 md:py-20 lg:py-24"> 
            <div className="
                    max-w-6xl mx-auto px-6 md:px-8 flex items-center w-full">
                <div className="
                    flex flex-col gap-4">

                    <h1 className="
                    text-white text-4xl 
                    md:text-6xl font-bold leading-tight
                    ">SmartPrep English</h1>

                    <p className="
                    text-white/90 text-lg md:text-xl text-left
                    max-w-md [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]
                    ">Learn English with SmartPrep. Exam-style practice to boost your English scores.</p>

                    <Button className="
                    bg-[var(--color-brand-blue)] 
                    text-white text-base md:text-lg
                    hover:-translate-y-0.5 hover:shadow-md
                    transition-all duration-200 hover:opacity-90
                    px-4 py-2 rounded-md 
                    font-medium font-[Karla] 
                    transition-colors 
                    flex items-center justify-center 
                    w-40 md:w-48
                    ">Get Started</Button>
                </div>
                <img 
                    src={heroImage} 
                    alt="Hero Image" 
                    className="
                    hidden
                    md:block
                    absolute md:right-[3rem] right-0 bottom-[-2rem] w-[clamp(16rem,28vw,21rem)] h-[clamp(16rem,28vw,21rem)] object-cover rounded-xl shadow-[0_0_35px_rgba(0,0,0,0.35)]" 
                />
            </div>
        </section>
    )
}