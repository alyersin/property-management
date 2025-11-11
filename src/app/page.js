"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { ROUTES, LOADING_MESSAGES } from "../constants/app";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace(ROUTES.login);
      }
    }
  }, [user, loading, router]);

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg="bg.body"
      color="text.primary"
    >
      <VStack spacing={4}>
        <Spinner size="xl" color="accent.default" />
        <Text color="text.muted">{LOADING_MESSAGES.default}</Text>
      </VStack>
    </Flex>
  );
}
