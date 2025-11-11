"use client";

import { VStack, HStack, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { TextField, TextareaField, NumberField, SelectField } from "./formFields";

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

    const commonProps = {
      key: name,
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
        return <SelectField {...commonProps} options={options} />;
      case 'textarea':
        return <TextareaField {...commonProps} />;
      case 'number':
        return <NumberField {...commonProps} />;
      case 'date':
        return <TextField {...commonProps} type="date" />;
      case 'email':
        return <TextField {...commonProps} type="email" />;
      case 'tel':
        return <TextField {...commonProps} type="tel" />;
      default:
        return <TextField {...commonProps} type={type} />;
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
