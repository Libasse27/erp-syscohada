import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Rechercher...',
  debounceTime = 300,
  showClearButton = true,
  size = 'md',
  className = '',
  ...props
}) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    if (debounceTime > 0) {
      const timer = setTimeout(() => {
        onChange?.(localValue);
        onSearch?.(localValue);
      }, debounceTime);

      return () => clearTimeout(timer);
    } else {
      onChange?.(localValue);
      onSearch?.(localValue);
    }
  }, [localValue, debounceTime]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    onSearch?.('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(localValue);
  };

  const sizes = {
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-base',
    lg: 'py-3 text-lg',
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            block w-full pl-10 pr-${showClearButton && localValue ? '10' : '4'}
            ${sizes[size]}
            border border-gray-300 rounded-lg
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
          `}
          {...props}
        />

        {/* Clear Button */}
        {showClearButton && localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  debounceTime: PropTypes.number,
  showClearButton: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default SearchBar;
