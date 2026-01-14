interface LogoProps {
    className?: string;
    style?: React.CSSProperties;
}

import logo from '../assets/logo5.png';

export default function Logo({className, style}: LogoProps) {
    return (
        <div 
            className={`flex items-center justify-center flex-shrink-0 ${className || ''}`} 
            style={{ 
                minWidth: '140px', 
                height: 'calc(100% - 8px)', 
                ...style
            }}
        >
            <img
                src={logo}
                alt="SmartPrep English logo"
                style={{ 
                    height: 'calc(100% - 8px)', 
                    width: 'auto',
                    display: 'block',
                    objectFit: 'contain'
                }}
            />
        </div>
    )
}