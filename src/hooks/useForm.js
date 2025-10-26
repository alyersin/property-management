import { useState, useEffect } from 'react';
import logger from '../utils/logger';

export const useForm = (initialValues = {}, storageKey = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load form data from localStorage if storageKey is provided
  useEffect(() => {
    if (storageKey) {
      try {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setValues(parsedData);
        }
      } catch (error) {
        logger.error('Failed to load form data from localStorage', error);
      }
    }
  }, [storageKey]);

  const handleChange = (field, value) => {
    const newValues = {
      ...values,
      [field]: value
    };
    setValues(newValues);
    
    // Save to localStorage if storageKey is provided
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(newValues));
      } catch (error) {
        logger.error('Failed to save form data to localStorage', error);
      }
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      logger.error('Form submission error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    
    // Clear localStorage if storageKey is provided
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (error) {
        logger.error('Failed to clear form data from localStorage', error);
      }
    }
  };

  const setError = (field, message) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setError
  };
};
