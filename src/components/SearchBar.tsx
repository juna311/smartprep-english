import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Button from './Button';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [search, setSearch] = useState('');

  // Your search click handler
  const onClick = () => {
    if (search.trim() === '') {
      console.log('Please enter a search term');
      return;
    }
    console.log('Searching for:', search);
  };

  // Optional: allow Enter key to trigger search
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onClick();
  };

  return (
    <div className={`flex flex-nowrap items-center gap-2 min-w-0 ${className || ''}`}>
      {/* Input + search icon */}
      <div className="relative flex-1 min-w-0">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={onKeyDown} // handle Enter key
          placeholder="Search..."
          className="w-full h-10 pl-9 pr-3 rounded-md border border-[--border-subtle] bg-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-[--color-brand-pink]"
        />
      </div>

      {/* Search button */}
      <Button
        onClick={onClick}
        className="h-10 px-4 rounded-md bg-[var(--color-brand-pink)] text-white whitespace-nowrap hover:opacity-90 active:scale-95 transition"
      >
        Search
      </Button>
    </div>
  );
}