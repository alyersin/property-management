"use client";

import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";

export default function PageLayout({ 
  title, 
  actions = [], 
  children, 
  currentPage 
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box minH="100vh" bg="gray.50">
      <PageHeader title={title} actions={actions} />
      <Flex>
        {!isMobile && <Sidebar currentPage={currentPage} />}
        <Box flex="1" p={isMobile ? 4 : 6} pt={isMobile ? 4 : 6}>
          {children}
        </Box>
      </Flex>
      {isMobile && <Sidebar currentPage={currentPage} />}
    </Box>
  );
}
