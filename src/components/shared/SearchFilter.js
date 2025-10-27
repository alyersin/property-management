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
    <Card mb={6}>
      <CardBody>
        <Flex gap={4} align="center">
          <InputGroup maxW="300px">
            <InputLeftElement>
              <Icon as={SearchIcon} />
            </InputLeftElement>
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </InputGroup>
          {Array.isArray(filterOptions) && filterOptions.length > 0 && (
            <Select
              maxW="200px"
              value={filterValue || "all"}
              onChange={(e) => handleFilterChange(e.target.value)}
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
