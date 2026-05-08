interface LogoProps {
    className?: string;
    style?: React.CSSProperties;
}

import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

interface LogoProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Logo({ className, style }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="Go to homepage"
      className={`flex items-center justify-center flex-shrink-0 ${className || ""}`}
      style={{
        minWidth: "140px",
        height: "calc(100% - 8px)",
        ...style,
      }}
    >
      <img
        src={logo}
        alt="SmartPrep English logo"
        style={{
          height: "calc(100% - 8px)",
          width: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />
    </Link>
  );
}