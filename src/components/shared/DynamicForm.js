"use client";

import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VStack,
  HStack,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

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

    switch (type) {
      case 'select':
        return (
          <FormControl key={name} isRequired={required}>
            <FormLabel>{label}</FormLabel>
            <Select
              value={value}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              {...props}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormControl>
        );

      case 'textarea':
        return (
          <FormControl key={name} isRequired={required}>
            <FormLabel>{label}</FormLabel>
            <Textarea
              value={value}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              {...props}
            />
          </FormControl>
        );

      case 'number':
        return (
          <FormControl key={name} isRequired={required}>
            <FormLabel>{label}</FormLabel>
            <NumberInput
              value={value}
              onChange={(val) => handleChange(name, val)}
              {...props}
            >
              <NumberInputField placeholder={placeholder} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        );

      case 'date':
        return (
          <FormControl key={name} isRequired={required}>
            <FormLabel>{label}</FormLabel>
            <Input
              type="date"
              value={value}
              onChange={(e) => handleChange(name, e.target.value)}
              {...props}
            />
          </FormControl>
        );

      case 'email':
        return (
          <FormControl key={name} isRequired={required}>
            <FormLabel>{label}</FormLabel>
            <Input
              type="email"
              value={value}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              {...props}
            />
          </FormControl>
        );

      case 'tel':
        return (
          <FormControl key={name} isRequired={required}>
            <FormLabel>{label}</FormLabel>
            <Input
              type="tel"
              value={value}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              {...props}
            />
          </FormControl>
        );

      default:
        return (
          <FormControl key={name} isRequired={required}>
            <FormLabel>{label}</FormLabel>
            <Input
              type={type}
              value={value}
              onChange={(e) => handleChange(name, e.target.value)}
              placeholder={placeholder}
              {...props}
            />
          </FormControl>
        );
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
            colorScheme="blue"
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
