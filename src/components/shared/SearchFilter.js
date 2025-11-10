"use client";

import {
  Card,
  CardBody,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

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
            <Select
              maxW="220px"
              value={filterValue || "all"}
              onChange={(e) => handleFilterChange(e.target.value)}
              bg="bg.surface"
              border="1px solid"
              borderColor="border.subtle"
            >
              <option value="all">{filterPlaceholder}</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          )}
        </Flex>
      </CardBody>
    </Card>
  );
}
