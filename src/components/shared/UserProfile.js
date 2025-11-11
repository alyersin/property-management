'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const UserProfile = ({ userId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user-profiles/${userId}`);
      if (res.ok) {
        const profileData = await res.json();
        setProfile(profileData);
        setFormData({
          phone: profileData.phone || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const method = profile ? 'PUT' : 'POST';
      await fetch(`/api/user-profiles/${userId}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      phone: profile?.phone || '',
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Box
        position="fixed"
        inset={0}
        bg="bg.overlay"
        backdropFilter="blur(8px)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={1000}
      >
        <Box
          bgGradient="linear(160deg, rgba(30, 45, 99, 0.85) 0%, rgba(16, 23, 52, 0.95) 100%)"
          borderRadius="xl"
          p={6}
          border="1px solid"
          borderColor="border.subtle"
          textAlign="center"
        >
          <Spinner size="lg" color="accent.default" />
          <Text mt={4} color="text.muted">
            Loading profile...
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      position="fixed"
      inset={0}
      bg="bg.overlay"
      backdropFilter="blur(10px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      zIndex={1000}
    >
      <Box
        bgGradient="linear(160deg, rgba(33, 49, 105, 0.9) 0%, rgba(17, 25, 56, 0.96) 100%)"
        borderRadius="2xl"
        border="1px solid"
        borderColor="border.subtle"
        w="full"
        maxW="3xl"
        maxH="90vh"
        overflowY="auto"
        p={{ base: 6, md: 8 }}
        boxShadow="xl"
      >
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg" color="text.primary">
            User Profile
          </Heading>
          <IconButton
            aria-label="Close"
            icon={<CloseIcon />}
            variant="ghost"
            onClick={onClose}
          />
        </Flex>

        {isEditing ? (
          <VStack spacing={5} align="stretch">
            <Box>
              <Text fontSize="sm" color="text.muted" mb={2}>
                Phone
              </Text>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
            </Box>

            <Flex justify="flex-end" gap={3} pt={2}>
              <Button variant="outline" onClick={handleCancel} isDisabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} isLoading={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Flex>
          </VStack>
        ) : (
          <VStack spacing={6} align="stretch">
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Box
                flex="1"
                bg="bg.surface"
                borderRadius="lg"
                p={4}
                border="1px solid"
                borderColor="border.subtle"
              >
                <Text fontSize="sm" color="text.muted" textTransform="uppercase">
                  Phone
                </Text>
                <Text mt={2} color="text.primary">
                  {profile?.phone || 'Not provided'}
                </Text>
              </Box>
            </Stack>

            <Flex justify="flex-end">
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            </Flex>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default UserProfile;
