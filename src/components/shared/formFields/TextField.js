import { FormControl, FormLabel, Input } from "@chakra-ui/react";

export default function TextField({ name, label, value, onChange, required, placeholder, type = "text", ...props }) {
  return (
    <FormControl isRequired={required}>
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        {...props}
      />
    </FormControl>
  );
}

