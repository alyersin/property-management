"use client";

import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";

export default function PageLayout({ 
  title, 
  actions = [], 
  children, 
  currentPage 
}) {
  return (
    <Box minH="100vh" bg="gray.50">
      <PageHeader title={title} actions={actions} />
      <Flex>
        <Sidebar currentPage={currentPage} />
        <Box flex="1" p={6}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
}
