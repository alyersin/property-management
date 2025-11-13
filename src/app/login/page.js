"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Text,
  Link,
  useToast
} from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ROUTES, DEMO_CREDENTIALS } from "../../constants/app";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const result = await login(email, password);
      if (result.success) {
        toast({
          title: "Login successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push(ROUTES.dashboard);
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg.surface"
      p={4}
    >
      <Container maxW="md">
        <Box
          bg="bg.surfaceAlt"
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          border="1px solid"
          borderColor="border.subtle"
        >
          <VStack spacing={6} align="stretch">
            <Heading
              size="lg"
              textAlign="center"
              color="text.primary"
            >
              Login
            </Heading>

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel color="text.primary">Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="bg.surface"
                    borderColor="border.subtle"
                    color="text.primary"
                    _hover={{ borderColor: "accent.default" }}
                    _focus={{ borderColor: "accent.default", boxShadow: "0 0 0 1px var(--chakra-colors-accent-default)" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="text.primary">Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="bg.surface"
                    borderColor="border.subtle"
                    color="text.primary"
                    _hover={{ borderColor: "accent.default" }}
                    _focus={{ borderColor: "accent.default", boxShadow: "0 0 0 1px var(--chakra-colors-accent-default)" }}
                  />
                </FormControl>

                {error && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  isLoading={loading}
                  loadingText="Logging in..."
                  colorScheme="blue"
                  width="full"
                  size="lg"
                >
                  Login
                </Button>
              </VStack>
            </form>

            <Box
              p={4}
              bg="bg.surface"
              borderRadius="md"
              border="1px solid"
              borderColor="border.subtle"
            >
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="text.muted"
                mb={2}
                textAlign="center"
              >
                Demo Credentials:
              </Text>
              <VStack spacing={1} align="stretch">
                <Text fontSize="sm" color="text.primary" textAlign="center">
                  {DEMO_CREDENTIALS.email}
                </Text>
                <Text fontSize="sm" color="text.primary" textAlign="center">
                  {DEMO_CREDENTIALS.password}
                </Text>
              </VStack>
            </Box>

            <Text textAlign="center" fontSize="sm" color="text.muted">
              Don't have an account?{" "}
              <Link href="/register" color="accent.default" fontWeight="medium">
                Sign up
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;

