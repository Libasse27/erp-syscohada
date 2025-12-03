import { useState, useCallback } from 'react';
import { validateForm } from '../utils/validators';

/**
 * Custom hook to manage form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules object
 * @param {Function} onSubmit - Submit handler function
 * @returns {Object} - Form state and handlers
 */
const useForm = (initialValues = {}, validationRules = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Handle field change
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    setIsDirty(true);

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle field blur
  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate single field on blur if rules exist
    if (validationRules[name]) {
      const fieldErrors = validateForm({ [name]: values[name] }, { [name]: validationRules[name] });
      if (fieldErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name],
        }));
      }
    }
  }, [values, validationRules]);

  // Set field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
  }, []);

  // Set field error programmatically
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  // Set field touched programmatically
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  // Validate all fields
  const validate = useCallback(() => {
    const validationErrors = validateForm(values, validationRules);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validationRules]);

  // Handle form submit
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate form
    const isValid = validate();

    if (isValid && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        // If error response contains field errors, set them
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  // Reset specific field
  const resetField = useCallback((name) => {
    setValues((prev) => ({
      ...prev,
      [name]: initialValues[name],
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    setTouched((prev) => ({
      ...prev,
      [name]: false,
    }));
  }, [initialValues]);

  // Set multiple values at once
  const setFormValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
    setIsDirty(true);
  }, []);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  // Get field props for easy binding
  const getFieldProps = (name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : undefined,
  });

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isDirty,
    isValid,

    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setFormValues,
    resetForm,
    resetField,
    validate,
    getFieldProps,
  };
};

// Named export
export { useForm };

// Default export
export default useForm;
