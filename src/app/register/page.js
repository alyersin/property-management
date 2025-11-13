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
import { ROUTES } from "../../constants/app";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      // Use email as name since form doesn't collect name separately
      const result = await register(email, email, password, confirmPassword);
      if (result.success) {
        toast({
          title: "Registration successful",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        router.push(ROUTES.dashboard);
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
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
              Register
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

                <FormControl isRequired>
                  <FormLabel color="text.primary">Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                  loadingText="Creating Account..."
                  colorScheme="blue"
                  width="full"
                  size="lg"
                >
                  Register
                </Button>
              </VStack>
            </form>

            <Text textAlign="center" fontSize="sm" color="text.muted">
              Already have an account?{" "}
              <Link href="/login" color="accent.default" fontWeight="medium">
                Login
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;

