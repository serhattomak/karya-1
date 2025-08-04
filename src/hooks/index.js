/**
 * Custom Hooks
 * Reusable React hooks for common operations
 */

import { useState, useEffect, useCallback } from 'react';
import { LOADING_STATES } from '../config/constants';
import { handleApiError } from '../utils/httpUtils';

// Generic API Hook
export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(LOADING_STATES.IDLE);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(LOADING_STATES.LOADING);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      setLoading(LOADING_STATES.SUCCESS);
      return result;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.message);
      setLoading(LOADING_STATES.ERROR);
      throw err;
    }
  }, dependencies);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(LOADING_STATES.IDLE);
  }, []);

  return {
    data,
    loading: loading === LOADING_STATES.LOADING,
    error,
    loadingState: loading,
    fetchData,
    reset,
    isIdle: loading === LOADING_STATES.IDLE,
    isLoading: loading === LOADING_STATES.LOADING,
    isSuccess: loading === LOADING_STATES.SUCCESS,
    isError: loading === LOADING_STATES.ERROR
  };
};

// Pagination Hook
export const usePagination = (initialPageSize = 10) => {
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: initialPageSize,
    totalCount: 0,
    totalPages: 0,
    sortColumn: '',
    sortDirection: 'asc'
  });

  const updatePagination = useCallback((updates) => {
    setPagination(prev => ({ ...prev, ...updates }));
  }, []);

  const goToPage = useCallback((pageIndex) => {
    setPagination(prev => ({ ...prev, pageIndex }));
  }, []);

  const changePageSize = useCallback((pageSize) => {
    setPagination(prev => ({ 
      ...prev, 
      pageSize, 
      pageIndex: 1 // Reset to first page when changing page size
    }));
  }, []);

  const setSorting = useCallback((sortColumn, sortDirection = 'asc') => {
    setPagination(prev => ({ ...prev, sortColumn, sortDirection }));
  }, []);

  const reset = useCallback(() => {
    setPagination({
      pageIndex: 1,
      pageSize: initialPageSize,
      totalCount: 0,
      totalPages: 0,
      sortColumn: '',
      sortDirection: 'asc'
    });
  }, [initialPageSize]);

  return {
    pagination,
    updatePagination,
    goToPage,
    changePageSize,
    setSorting,
    reset
  };
};

// Form Hook
export const useForm = (initialValues, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);

  const validate = useCallback(() => {
    if (!validationSchema) return true;

    const validationErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(field => {
      const rules = validationSchema[field];
      const value = values[field];

      if (rules.required && (!value || value.toString().trim() === '')) {
        validationErrors[field] = `${rules.label || field} gereklidir`;
        isValid = false;
      } else if (value && rules.minLength && value.toString().length < rules.minLength) {
        validationErrors[field] = `${rules.label || field} en az ${rules.minLength} karakter olmalıdır`;
        isValid = false;
      } else if (value && rules.maxLength && value.toString().length > rules.maxLength) {
        validationErrors[field] = `${rules.label || field} en fazla ${rules.maxLength} karakter olmalıdır`;
        isValid = false;
      } else if (value && rules.pattern && !rules.pattern.test(value)) {
        validationErrors[field] = rules.message || `${rules.label || field} formatı geçersiz`;
        isValid = false;
      }
    });

    setErrors(validationErrors);
    return isValid;
  }, [values, validationSchema]);

  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(values).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    try {
      if (validate()) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validate,
    handleSubmit,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// File Upload Hook
export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadFile = useCallback(async (file, uploadFunction) => {
    if (!file) return null;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      const result = await uploadFunction(file);
      setUploadProgress(100);
      return result;
    } catch (error) {
      setUploadError(error.message);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
  }, []);

  return {
    uploadProgress,
    isUploading,
    uploadError,
    uploadFile,
    reset
  };
};

// Local Storage Hook
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Debounce Hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
