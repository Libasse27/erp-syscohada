import PropTypes from 'prop-types';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          block w-full rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'}
          px-3 py-2 text-gray-900
          focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default Select;
