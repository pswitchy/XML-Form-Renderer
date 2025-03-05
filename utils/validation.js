export const validateField = (field, value) => {
    const errors = [];
  
    if (field.required && !value) {
      errors.push(`${field.label} is required`);
    }
  
    switch (field.type) {
      case 'text':
        if (value && value.length > field.length) {
          errors.push(`${field.label} cannot exceed ${field.length} characters`);
        }
        break;
  
      case 'date':
        if (value && !(value instanceof Date) && isNaN(new Date(value))) {
          errors.push(`${field.label} must be a valid date`);
        }
        break;
  
      case 'radio':
        if (value && !field.options.find(opt => opt.value === value)) {
          errors.push(`${field.label} must be one of the provided options`);
        }
        break;
    }
  
    return errors;
  };