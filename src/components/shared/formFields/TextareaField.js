import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";

export default function TextareaField({ name, label, value, onChange, required, placeholder, ...props }) {
  return (
    <FormControl isRequired={required}>
      <FormLabel>{label}</FormLabel>
      <Textarea
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        {...props}
      />
    </FormControl>
  );
}

