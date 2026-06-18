import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const query = search.trim();

    if (!query) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className={`flex flex-nowrap items-center gap-2 min-w-0 ${className || ''}`}>
      {/* Input + search icon */}
      <div className="relative flex-1 min-w-0">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search"
          className="w-full h-10 pl-9 pr-3 rounded-md border border-[var(--color-border-soft)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-xs placeholder:text-xs font-[Karla]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
        />
      </div>

      {/* Search button */}
      <Button
        onClick={handleSearch}
        disabled={!search.trim()}
        className="h-10 px-4 rounded-md bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] hover:bg-[var(--color-brand-gold-light)] disabled:opacity-50 whitespace-nowrap font-medium font-[Karla] transition-colors"
      >
        Search
      </Button>
    </div>
  );
}
