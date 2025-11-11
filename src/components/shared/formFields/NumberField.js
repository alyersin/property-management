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
  return (
    <FormControl isRequired={required}>
      <FormLabel>{label}</FormLabel>
      <NumberInput value={value} onChange={(val) => onChange(name, val)} {...props}>
        <NumberInputField placeholder={placeholder} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </FormControl>
  );
}

