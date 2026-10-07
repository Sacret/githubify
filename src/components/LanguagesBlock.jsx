import { toggle, useFilters } from '../filters';

/**
 *  LanguagesBlock contains list of all languages
 */
export default function LanguagesBlock({ languages }) {
  const { filters, setFilters } = useFilters();

  return (
    <div className="languages-block">
      {languages.map((language) => (
        <span
          className={'tag language' + (filters.languages.includes(language) ? ' active' : '')}
          key={language}
          onClick={() => setFilters({ languages: toggle(filters.languages, language) })}
        >
          {language}
        </span>
      ))}
    </div>
  );
}
