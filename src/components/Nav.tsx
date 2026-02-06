import { NavLink } from 'react-router-dom';

interface NavProps {
  className?: string;
  onNavigate?: () => void;
}

export default function Nav({ className, onNavigate }: NavProps) {
  return (
    <nav className={`flex justify-start md:justify-center w-full ${className || ''}`}>
      <ul className="flex flex-col gap-0 md:flex-row md:gap-8">
        <li>
          <NavLink 
            to="/grammar"
            onClick={onNavigate} 
            className={({ isActive }) => 
              `block w-full font-medium font-[Karla] px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'text-[var(--color-brand-pink)] bg-[var(--color-brand-pink)]/10' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-[var(--color-brand-blue)]/10'
              }`
            }
          >
            Grammar
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/vocab"
            onClick={onNavigate} 
            className={({ isActive }) => 
              `block w-full font-medium font-[Karla] px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'text-[var(--color-brand-pink)] bg-[var(--color-brand-pink)]/10' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-[var(--color-brand-blue)]/10'
              }`
            }
          >
            Vocabulary
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/practice"
            onClick={onNavigate} 
            className={({ isActive }) => 
              `block w-full font-medium font-[Karla] px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'text-[var(--color-brand-pink)] bg-[var(--color-brand-pink)]/10' 
                  : 'text-gray-700 hover:text-gray-900 hover:bg-[var(--color-brand-blue)]/10'
              }`
            }
          >
            Practice
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}