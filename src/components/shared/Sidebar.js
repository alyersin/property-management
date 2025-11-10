"use client";

import {
  Box,
  VStack,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { NAVIGATION_ITEMS } from "../../utils/constants";

export default function Sidebar({ currentPage }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const NavigationContent = () => (
    <VStack align="stretch" spacing={2}>
      {NAVIGATION_ITEMS.map((item) => (
        <Button
          key={item.href}
          as="a"
          href={item.href}
          variant="ghost"
          justifyContent="flex-start"
          height="48px"
          px={4}
          fontWeight="500"
          bg={currentPage === item.href ? "accent.subtle" : "transparent"}
          color={currentPage === item.href ? "accent.emphasis" : "text.muted"}
          _hover={{
            bg: "accent.subtle",
            color: "accent.emphasis",
          }}
          onClick={isMobile ? onClose : undefined}
        >
          {item.label}
        </Button>
      ))}
    </VStack>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="ghost"
          size="sm"
          position="fixed"
          top="20px"
          left="20px"
          zIndex={1000}
          bg="bg.surface"
          color="text.primary"
          border="1px solid"
          borderColor="border.subtle"
        />
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay bg="bg.overlay" />
          <DrawerContent
            bgGradient="linear(180deg, rgba(9, 18, 46, 1) 0%, rgba(7, 13, 32, 1) 100%)"
            color="text.primary"
          >
            <DrawerCloseButton />
            <DrawerHeader borderBottom="1px solid" borderColor="border.subtle">
              Navigation
            </DrawerHeader>
            <DrawerBody mt={4}>
              <VStack align="flex-start" spacing={6} mb={6}>
                <Box
                  fontSize="lg"
                  fontWeight="700"
                  letterSpacing="wide"
                  color="accent.emphasis"
                >
                  Home Admin
                </Box>
              </VStack>
              <NavigationContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Box
      w="260px"
      bgGradient="linear(180deg, rgba(9, 18, 46, 1) 0%, rgba(7, 13, 32, 1) 100%)"
      color="text.primary"
      minH="calc(100vh - 80px)"
      px={6}
      py={8}
      borderRight="1px solid"
      borderColor="border.subtle"
    >
      <Box mb={10}>
        <VStack align="flex-start" spacing={1}>
          <Box
            fontSize="lg"
            fontWeight="700"
            letterSpacing="wide"
            color="accent.emphasis"
          >
            Home Admin
          </Box>
          <Box fontSize="xs" color="text.muted" textTransform="uppercase">
            Dashboard
          </Box>
        </VStack>
      </Box>
      <NavigationContent />
    </Box>
  );
}
