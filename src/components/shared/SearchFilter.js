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
import { Search as SearchIcon } from "@chakra-ui/icons";

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "All",
}) {
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
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>
          {filterOptions.length > 0 && (
            <Select
              maxW="200px"
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
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
