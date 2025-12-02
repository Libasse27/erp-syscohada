import PropTypes from 'prop-types';

const Loader = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  text,
  className = '',
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colors = {
    primary: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-600',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          animate-spin rounded-full border-4 border-gray-200
          ${colors[variant]} border-t-transparent
          ${sizes[size]}
        `}
      />
      {text && <p className="mt-4 text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        {spinner}
      </div>
    );
  }

  return spinner;
};

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'white', 'gray']),
  fullScreen: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string,
};

export default Loader;
