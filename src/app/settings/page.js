"use client";

import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import PageLayout from "../../components/shared/PageLayout";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

export default function Settings() {
  const toast = useToast();
  const { user, updateUser } = useAuth();
  const [info, setInfo] = useState({
    name: "",
    email: "",
  });
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const userId = user?.id;

  const loadProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setInfo((prev) => ({
      ...prev,
      name: user?.name || "",
      email: user?.email || "",
    }));

    try {
      const res = await fetch(`/api/user-profiles/${userId}`);
      if (res.ok) {
        const profile = await res.json();
        setProfileExists(true);
      } else if (res.status === 404) {
        setProfileExists(false);
      } else {
        console.error("[ERROR] Failed to load profile", await res.text());
        toast({
          title: "Failed to load profile",
          status: "error",
        });
      }
    } catch (error) {
      console.error("[ERROR] Error loading profile", error);
      toast({
        title: "Failed to load profile",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, user?.email, user?.name, userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleChange = (field, value) => {
    setInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!userId) return;

    setSaving(true);

    try {
      const userResponse = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: info.name, email: info.email }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to update account information");
      }

      // User profile is now empty, but we still need to create/update the profile record
      const profileResponse = await fetch(`/api/user-profiles/${userId}`, {
        method: profileExists ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile information");
      }

      setProfileExists(true);
      updateUser({ name: info.name, email: info.email });

      toast({
        title: "Information updated",
        status: "success",
      });
    } catch (error) {
      console.error("[ERROR] Failed to save settings", error);
      toast({
        title: "Failed to save information",
        description: error.message,
        status: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <PageLayout title="Settings">
        <VStack spacing={6} align="stretch">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <Heading size="md" color="text.primary">
                Account Information
              </Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="text.primary">Name</FormLabel>
                  <Input
                    value={info.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    isDisabled={loading}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="text.primary">Email</FormLabel>
                  <Input
                    type="email"
                    value={info.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    isDisabled={loading}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Save Button */}
          <Box>
            <Button
              onClick={handleSave}
              size="lg"
              isLoading={saving}
              isDisabled={loading}
            >
              Save Settings
            </Button>
          </Box>
        </VStack>
      </PageLayout>
    </ProtectedRoute>
  );
}