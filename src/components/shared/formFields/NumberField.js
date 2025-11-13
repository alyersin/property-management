import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

export default function NumberField({ name, label, value, onChange, required, placeholder, ...props }) {
  // Format value to remove trailing zeros for whole numbers (e.g., 1.0 -> 1)
  const formatValue = (val) => {
    if (val === '' || val === undefined || val === null) return '';
    const num = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(num)) return val;
    // If it's a whole number, return as integer string, otherwise return formatted decimal
    if (num % 1 === 0) {
      return num.toString();
    }
    // For decimals, return the original string representation to preserve precision
    return typeof val === 'string' ? val : num.toString();
  };

  const formattedValue = formatValue(value);

  return (
    <FormControl isRequired={required}>
      <FormLabel>{label}</FormLabel>
      <NumberInput 
        value={formattedValue} 
        onChange={(val) => onChange(name, val)} 
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
}

