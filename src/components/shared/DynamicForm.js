"use client";

import {
  FormControl,
  FormLabel,
  Input,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack as ChakraHStack,
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";
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
      case 'select': {
        const selectedOption =
          options.find((option) => option.value === value) || null;

        return (
          <FormControl key={name} isRequired={required}>
            <FormLabel>{label}</FormLabel>
            <Menu matchWidth>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                justifyContent="space-between"
                textAlign="left"
                bg="bg.surface"
                border="1px solid"
                borderColor="border.subtle"
                fontWeight="500"
                width="100%"
              >
                {selectedOption ? selectedOption.label : placeholder || "Select"}
              </MenuButton>
              <MenuList
                bg="bg.surface"
                border="1px solid"
                borderColor="border.subtle"
                color="text.primary"
                width="100%"
              >
                {options.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => handleChange(name, option.value)}
                  >
                    <ChakraHStack justify="space-between" w="full">
                      <Text>{option.label}</Text>
                      {value === option.value && <CheckIcon boxSize={3} />}
                    </ChakraHStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </FormControl>
        );
      }

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
