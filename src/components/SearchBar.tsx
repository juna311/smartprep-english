import { useId, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const searchInputId = useId();
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();

    if (!query) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSearch}
      className={`flex flex-nowrap items-center gap-2 min-w-0 ${className || ""}`}
    >
      <div className="relative flex-1 min-w-0">
        <label htmlFor={searchInputId} className="sr-only">
          Search grammar lessons and vocabulary
        </label>
        <FaSearch
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
        />
        <input
          id={searchInputId}
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          autoComplete="off"
          className="w-full h-10 pl-9 pr-3 rounded-md border border-[var(--color-border-soft)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] text-xs placeholder:text-xs font-[Karla]
                     focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-gold)]"
        />
      </div>

      <Button
        type="submit"
        disabled={!search.trim()}
        variant="gold"
        className="h-10 px-4 rounded-md whitespace-nowrap font-medium font-[Karla]"
      >
        Search
      </Button>
    </form>
  );
}
