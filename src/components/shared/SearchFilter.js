"use client";

import {
  Card,
  CardBody,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Text,
  HStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";

export default function SearchFilter({
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue = "all",
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "All",
}) {
  const handleSearchChange = (value) => {
    if (typeof onSearchChange === 'function') {
      onSearchChange(value);
    }
  };

  const handleFilterChange = (value) => {
    if (typeof onFilterChange === 'function') {
      onFilterChange(value);
    }
  };

  const currentFilter = Array.isArray(filterOptions)
    ? filterOptions.find((option) => option.value === filterValue)
    : null;

  return (
    <Card
      mb={6}
      bgGradient="linear(160deg, rgba(30, 45, 99, 0.85) 0%, rgba(16, 23, 52, 0.95) 100%)"
      borderColor="border.subtle"
    >
      <CardBody>
        <Flex gap={4} align="center" flexWrap="wrap">
          <InputGroup maxW="360px" bg="bg.surface" borderRadius="lg">
            <InputLeftElement pointerEvents="none" color="text.muted">
              <Icon as={SearchIcon} />
            </InputLeftElement>
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              border="none"
              _focusVisible={{
                border: "none",
                boxShadow: "0 0 0 1px var(--chakra-colors-accent-default)",
              }}
            />
          </InputGroup>
          {Array.isArray(filterOptions) && filterOptions.length > 0 && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                bg="bg.surface"
                border="1px solid"
                borderColor="border.subtle"
                _hover={{ bg: "bg.surface" }}
                _expanded={{ bg: "bg.surface" }}
                px={4}
                py={2}
                minW="220px"
                textAlign="left"
              >
                <Box>
                  <Text fontSize="xs" color="text.muted" textTransform="uppercase">
                    Filter
                  </Text>
                  <Text fontSize="sm" color="text.primary">
                    {currentFilter?.label || filterPlaceholder}
                  </Text>
                </Box>
              </MenuButton>
              <MenuList
                bg="bg.surface"
                border="1px solid"
                borderColor="border.subtle"
                color="text.primary"
              >
                <MenuItem onClick={() => handleFilterChange("all")}>
                  <HStack justify="space-between" w="full">
                    <Text>{filterPlaceholder}</Text>
                    {filterValue === "all" && <CheckIcon boxSize={3} />}
                  </HStack>
                </MenuItem>
                {filterOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => handleFilterChange(option.value)}
                  >
                    <HStack justify="space-between" w="full">
                      <Text>{option.label}</Text>
                      {filterValue === option.value && <CheckIcon boxSize={3} />}
                    </HStack>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
}
