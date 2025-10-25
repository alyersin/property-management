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
} from "@chakra-ui/react";
import { useState } from "react";
import PageLayout from "../../components/shared/PageLayout";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: "Home Admin",
    email: "admin@homeadmin.com",
    phone: "(555) 123-4567",
    address: "123 Admin Street, San Francisco, CA 94102",
    notifications: {
      email: true,
      sms: false,
      repair: true,
      payments: true,
    },
    preferences: {
      theme: "light",
      currency: "USD",
      timezone: "PST",
    }
  });

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
    // TODO: Implement save to database
    console.log("Settings saved:", settings);
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
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  />
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text>SMS Notifications</Text>
                  <Switch
                    isChecked={settings.notifications.sms}
                    onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                  />
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text>Repair Alerts</Text>
                  <Switch
                    isChecked={settings.notifications.repair}
                    onChange={(e) => handleSettingChange('notifications', 'repair', e.target.checked)}
                  />
                </HStack>
                <HStack justify="space-between" w="full">
                  <Text>Payment Alerts</Text>
                  <Switch
                    isChecked={settings.notifications.payments}
                    onChange={(e) => handleSettingChange('notifications', 'payments', e.target.checked)}
                  />
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <Heading size="md">Preferences</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <FormControl>
                  <FormLabel>Theme</FormLabel>
                  <Input value={settings.preferences.theme} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Currency</FormLabel>
                  <Input value={settings.preferences.currency} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Timezone</FormLabel>
                  <Input value={settings.preferences.timezone} readOnly />
                </FormControl>
              </SimpleGrid>
            </CardBody>
          </Card>

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