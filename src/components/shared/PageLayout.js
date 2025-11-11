"use client";

import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";

export default function PageLayout({
  title,
  actions = [],
  children,
}) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box minH="100vh" bg="bg.body">
      {isMobile && <Sidebar />}
      <PageHeader title={title} actions={actions} />
      <Flex align="flex-start">
        {!isMobile && <Sidebar />}
        <Box
          flex="1"
          color="text.primary"
          bgGradient="linear(160deg, rgba(17, 25, 56, 0.92) 0%, rgba(10, 17, 38, 0.96) 100%)"
          minH="calc(100vh - 80px)"
          px={isMobile ? 4 : 8}
          py={isMobile ? 4 : 8}
          borderLeft={{ base: "none", md: "1px solid" }}
          borderColor={{ base: "transparent", md: "border.subtle" }}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  );
}
