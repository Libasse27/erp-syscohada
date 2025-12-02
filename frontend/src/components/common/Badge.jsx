import PropTypes from 'prop-types';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  className = '',
  ...props
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-cyan-100 text-cyan-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${roundedClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'success', 'danger', 'warning', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
