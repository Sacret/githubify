import { useState } from 'react';

const MAX_VISIBLE = 5;

/**
 *  Input for comma-separated values with suggestions for the last value
 */
export default function Typeahead({ options, placeholder, onSubmit }) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const parts = value.split(',');
  const search = parts[parts.length - 1].trim().toLowerCase();
  const suggestions = search ?
    options
      .filter((option) => option.toLowerCase().includes(search))
      .slice(0, MAX_VISIBLE) :
    [];
  const visible = isOpen ? suggestions : [];

  function submit(newValue) {
    onSubmit(newValue);
    setValue('');
    setSelectedIndex(-1);
  }

  function select(option) {
    submit([...parts.slice(0, -1), option].join(','));
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setSelectedIndex((index) => Math.max(-1, Math.min(visible.length - 1, index + step)));
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (visible[selectedIndex]) {
        select(visible[selectedIndex]);
      }
      else {
        submit(value);
      }
    }
    else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div className="typeahead">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setIsOpen(true);
          setSelectedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      {visible.length ?
        <ul className="typeahead-selector">
          {visible.map((option, index) => (
            <li key={option} className={index === selectedIndex ? 'hover' : ''}>
              <a
                href="#"
                className="typeahead-option"
                // mousedown fires before input blur hides the list
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(option);
                }}
              >
                {option}
              </a>
            </li>
          ))}
        </ul> :
        null
      }
    </div>
  );
}
