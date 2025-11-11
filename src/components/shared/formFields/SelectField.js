import {
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  HStack,
} from "@chakra-ui/react";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";

export default function SelectField({ name, label, value, onChange, required, placeholder, options = [] }) {
  const selectedOption = options.find((option) => option.value === value) || null;

  return (
    <FormControl isRequired={required}>
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
            <MenuItem key={option.value} onClick={() => onChange(name, option.value)}>
              <HStack justify="space-between" w="full">
                <Text>{option.label}</Text>
                {value === option.value && <CheckIcon boxSize={3} />}
              </HStack>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </FormControl>
  );
}

