"use client";

import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  HStack,
  Switch,
  Divider,
  SimpleGrid,
  Tooltip,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import PageLayout from "../../components/shared/PageLayout";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { COMPANY_DEFAULTS, NOTIFICATION_DEFAULTS, STORAGE_KEYS } from "../../constants/app";
import logger from "../../utils/logger";

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: COMPANY_DEFAULTS.name,
    email: COMPANY_DEFAULTS.email,
    phone: COMPANY_DEFAULTS.phone,
    address: COMPANY_DEFAULTS.address,
    notifications: NOTIFICATION_DEFAULTS
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEYS.preferences);
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        logger.error('Failed to load settings from localStorage', error);
      }
    }
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    try {
      // Save settings to localStorage
      localStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(settings));
      logger.success("Settings saved successfully", { settings });
    } catch (error) {
      logger.error("Failed to save settings", error);
    }
  };

  return (
    <ProtectedRoute>
      <PageLayout title="Settings" currentPage="/settings">
        <VStack spacing={6} align="stretch">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <Heading size="md">Company Information</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Company Name</FormLabel>
                  <Input
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange('companyName', 'companyName', e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', 'email', e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    value={settings.phone}
                    onChange={(e) => handleSettingChange('phone', 'phone', e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    value={settings.address}
                    onChange={(e) => handleSettingChange('address', 'address', e.target.value)}
                  />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

          {/* Notification Settings */}
          <Tooltip label="Under Development" hasArrow>
            <Card>
              <CardHeader>
                <Heading size="md">Notification Settings</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" w="full">
                    <Text>Email Notifications</Text>
                    <Switch
                      isChecked={settings.notifications.email}
                      isDisabled={true}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text>SMS Notifications</Text>
                    <Switch
                      isChecked={settings.notifications.sms}
                      isDisabled={true}
                      onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                    />
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text>Repair Alerts</Text>
                    <Switch
                      isChecked={settings.notifications.repair}
                      isDisabled={true}
                      onChange={(e) => handleSettingChange('notifications', 'repair', e.target.checked)}
                    />
                  </HStack>
                  <HStack justify="space-between" w="full">
                    <Text>Payment Alerts</Text>
                    <Switch
                      isChecked={settings.notifications.payments}
                      isDisabled={true}
                      onChange={(e) => handleSettingChange('notifications', 'payments', e.target.checked)}
                    />
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </Tooltip>

          {/* Save Button */}
          <Box>
            <Button colorScheme="blue" onClick={handleSave} size="lg">
              Save Settings
            </Button>
          </Box>
        </VStack>
      </PageLayout>
    </ProtectedRoute>
  );
}