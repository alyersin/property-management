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
          colorScheme={currentPage === item.href ? "blue" : undefined}
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
          variant="outline"
          size="sm"
          position="fixed"
          top="20px"
          left="20px"
          zIndex={1000}
          bg="white"
          shadow="md"
        />
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Navigation</DrawerHeader>
            <DrawerBody>
              <NavigationContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <Box w="250px" bg="white" minH="calc(100vh - 80px)" shadow="sm" p={4}>
      <NavigationContent />
    </Box>
  );
}
