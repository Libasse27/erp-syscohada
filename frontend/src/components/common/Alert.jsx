import PropTypes from 'prop-types';

const Alert = ({
  children,
  variant = 'info',
  title,
  onClose,
  icon,
  className = '',
  ...props
}) => {
  const variants = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-400',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-400',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-400',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-400',
    },
  };

  const variantClasses = variants[variant];

  return (
    <div
      className={`
        ${variantClasses.bg} ${variantClasses.border} ${variantClasses.text}
        border rounded-lg p-4
        ${className}
      `}
      role="alert"
      {...props}
    >
      <div className="flex">
        {icon && (
          <div className={`flex-shrink-0 ${variantClasses.icon}`}>
            {icon}
          </div>
        )}
        <div className={`${icon ? 'ml-3' : ''} flex-1`}>
          {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={`
              flex-shrink-0 ml-3 inline-flex ${variantClasses.text}
              hover:opacity-75 focus:outline-none
            `}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  onClose: PropTypes.func,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default Alert;
