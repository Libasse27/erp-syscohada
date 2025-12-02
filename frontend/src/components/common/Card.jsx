import PropTypes from 'prop-types';

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  hoverable = false,
  padding = 'default',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 shadow-sm
        ${hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  footer: PropTypes.node,
  className: PropTypes.string,
  hoverable: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
};

export default Card;
