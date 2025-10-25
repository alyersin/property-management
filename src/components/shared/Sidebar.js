"use client";

import {
  Box,
  VStack,
  Button,
} from "@chakra-ui/react";
import { NAVIGATION_ITEMS } from "../../utils/constants";

export default function Sidebar({ currentPage }) {
  return (
    <Box w="250px" bg="white" minH="calc(100vh - 80px)" shadow="sm" p={4}>
      <VStack align="stretch" spacing={2}>
        {NAVIGATION_ITEMS.map((item) => (
          <Button
            key={item.href}
            as="a"
            href={item.href}
            variant="ghost"
            justifyContent="flex-start"
            colorScheme={currentPage === item.href ? "blue" : undefined}
          >
            {item.label}
          </Button>
        ))}
      </VStack>
    </Box>
  );
}
