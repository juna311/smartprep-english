interface LogoProps {
    className?: string;
}

import logo from '../assets/logo.png';

export default function Logo({className}: LogoProps) {
    return (
        <img
            src={logo}
            alt="SmartPrep English logo"
            className={`h-10 md:h-12 w-auto ${className || ''}`}
/>
    )
}