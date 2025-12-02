import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({
  label,
  name,
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  onChange,
  error,
  disabled = false,
  required = false,
  showPreview = true,
  className = '',
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (maxSize && file.size > maxSize) {
      return `Le fichier ${file.name} dépasse la taille maximale de ${formatFileSize(maxSize)}`;
    }
    return null;
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    const validFiles = [];
    let errorMessage = null;

    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        errorMessage = error;
        break;
      }
      validFiles.push(file);
    }

    if (errorMessage) {
      onChange?.([], errorMessage);
      return;
    }

    setFiles(multiple ? [...files, ...validFiles] : validFiles);
    onChange?.(multiple ? [...files, ...validFiles] : validFiles, null);
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles, null);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-500' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={name}
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className="hidden"
          {...props}
        />

        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium text-blue-600 hover:text-blue-500">
            Cliquez pour télécharger
          </span>{' '}
          ou glissez-déposez
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {accept ? accept.replace(/\./g, '').toUpperCase() : 'Tous les fichiers'}{' '}
          {maxSize && `(max. ${formatFileSize(maxSize)})`}
        </p>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {/* File Preview */}
      {showPreview && files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <svg
                  className="h-8 w-8 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  showPreview: PropTypes.bool,
  className: PropTypes.string,
};

export default FileUpload;
