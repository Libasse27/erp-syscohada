import PropTypes from 'prop-types';

const DatePicker = ({
  label,
  name,
  value,
  onChange,
  min,
  max,
  error,
  disabled = false,
  required = false,
  placeholder = 'Sélectionner une date',
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <input
          type="date"
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            block w-full pl-10 pr-3 py-2 rounded-lg border
            ${error ? 'border-red-500' : 'border-gray-300'}
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2
            ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
            focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

DatePicker.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.string,
  max: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default DatePicker;
