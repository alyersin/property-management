"use client";

import { VStack, HStack, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import TextField from "./formFields/TextField";
import TextareaField from "./formFields/TextareaField";
import NumberField from "./formFields/NumberField";
import SelectField from "./formFields/SelectField";

const DynamicForm = ({ 
  fields = [], 
  values = {}, 
  onChange, 
  onSubmit, 
  onCancel,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isLoading = false 
}) => {
  const [formData, setFormData] = useState(values);

  useEffect(() => {
    setFormData(values);
  }, [values]);

  const handleChange = (fieldName, value) => {
    const newData = { ...formData, [fieldName]: value };
    setFormData(newData);
    if (onChange) onChange(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  const renderField = (field) => {
    const { name, label, type, options = [], required = false, placeholder, ...props } = field;
    const value = formData[name] || '';

    // Extract key separately - React keys must be passed directly, not via spread
    const commonProps = {
      name,
      label,
      value,
      onChange: handleChange,
      required,
      placeholder,
      ...props
    };

    switch (type) {
      case 'select':
        return <SelectField key={name} {...commonProps} options={options} />;
      case 'textarea':
        return <TextareaField key={name} {...commonProps} />;
      case 'number':
        return <NumberField key={name} {...commonProps} />;
      case 'date':
        return <TextField key={name} {...commonProps} type="date" />;
      case 'email':
        return <TextField key={name} {...commonProps} type="email" />;
      case 'tel':
        return <TextField key={name} {...commonProps} type="tel" />;
      default:
        return <TextField key={name} {...commonProps} type={type} />;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        {fields.map(renderField)}
        
        <HStack spacing={4} justify="flex-end" pt={4}>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            loadingText="Saving..."
          >
            {submitLabel}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default DynamicForm;
