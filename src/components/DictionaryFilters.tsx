interface DictionaryFiltersProps {
    topicFilter: string;
    setTopicFilter: (value: string) => void;
    levelFilter: string;
    setLevelFilter: (value: string) => void;
    topics: string[];
    levels: string[];
  }
  
  export default function DictionaryFilters({
    topicFilter,
    setTopicFilter,
    levelFilter,
    setLevelFilter,
    topics,
    levels,
  }: DictionaryFiltersProps) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="
            border border-[var(--color-brand-blue)]
            rounded-md px-3 py-2
            bg-white text-[var(--color-brand-blue)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]
          "
        >
          <option value="all">All topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </option>
          ))}
        </select>
  
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="
            border border-[var(--color-brand-blue)]
            rounded-md px-3 py-2
            bg-white text-[var(--color-brand-blue)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-blue)]
          "
        >
          <option value="all">All levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  }