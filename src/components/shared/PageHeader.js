"use client";

import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

export default function PageHeader({ title, actions = [] }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Box
      bgGradient="linear(160deg, rgba(13, 22, 45, 0.95) 0%, rgba(8, 14, 28, 0.98) 100%)"
      px={isMobile ? 4 : 8}
      py={isMobile ? 4 : 6}
      borderBottom="1px solid"
      borderColor="border.subtle"
    >
      <Flex justify="space-between" align="center">
        {isMobile ? (
          <Box w="40px" />
        ) : (
          <Heading size="lg" color="accent.emphasis" fontWeight="700">
            {title}
          </Heading>
        )}

        {isMobile ? (
          <Box flex="1" display="flex" justifyContent="center">
            <Logo isMobile={true} />
          </Box>
        ) : (
          <HStack spacing={4}>
            {actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.variant || "outline"}
                leftIcon={
                  action.icon ? <Icon as={action.icon} boxSize={4} /> : undefined
                }
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </HStack>
        )}

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
            size={isMobile ? "sm" : "md"}
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _expanded={{ bg: "transparent" }}
          >
            <HStack>
              <Avatar
                size="sm"
                name={user?.name}
                bg="accent.subtle"
                color="text.primary"
                fontWeight="bold"
              />
              {!isMobile && (
                <VStack spacing={0} align="flex-start">
                  <Text fontSize="sm" color="text.primary">
                    {user?.name}
                  </Text>
                  <Text fontSize="xs" color="text.muted">
                    {user?.email}
                  </Text>
                </VStack>
              )}
            </HStack>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => router.push("/settings")}>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} color="danger.default">
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
}
