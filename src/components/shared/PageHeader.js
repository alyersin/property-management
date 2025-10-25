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
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function PageHeader({ title, actions = [] }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Box bg="white" shadow="sm" px={6} py={4}>
      <Flex justify="space-between" align="center">
        <Heading size="lg" color="blue.600">
          {title}
        </Heading>
        <HStack spacing={4}>
          {actions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              variant={action.variant || "outline"}
              colorScheme={action.colorScheme}
              leftIcon={action.icon ? <Icon as={action.icon} /> : undefined}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
          
          {/* User Menu */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="ghost">
              <HStack>
                <Avatar size="sm" name={user?.name} />
                <Text fontSize="sm">{user?.name}</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => router.push("/settings")}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout} color="red.500">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}
