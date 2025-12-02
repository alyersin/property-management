"use client";

import {
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Box,
  Progress,
  VStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import StatCard from "../shared/StatCard";

const EMPTY_STATS = {
  totalProperties: 0,
  occupiedProperties: 0,
  availableProperties: 0,
  occupancyRate: 0,
};

const DashboardStats = ({ stats, recentActivities = [] }) => {
  const safeStats = stats ?? EMPTY_STATS;

  const getActivityIcon = (type) => {
    const icons = {
      property: "🏠",
      tenant: "👥",
    };
    return icons[type] || "📊";
  };

  const available =
    safeStats.totalProperties > 0
      ? safeStats.availableProperties ?? (safeStats.totalProperties - safeStats.occupiedProperties)
      : 0;
  const availablePercentage =
    safeStats.totalProperties > 0
      ? (available / safeStats.totalProperties) * 100
      : 0;

  return (
    <VStack spacing={8} align="stretch">
      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <StatCard
          label="Total Properties"
          value={safeStats.totalProperties}
          helpText={`${safeStats.occupiedProperties} occupied`}
          color="accent.emphasis"
          arrowType="increase"
        />
        <StatCard
          label="Occupied Properties"
          value={safeStats.occupiedProperties}
          helpText={`of ${safeStats.totalProperties}`}
          color="accent.default"
          arrowType="increase"
        />
        <StatCard
          label="Available Properties"
          value={available}
          helpText="Available"
          color="success.default"
          arrowType="increase"
        />
      </SimpleGrid>

      {/* Property Overview */}
      <Box
        bgGradient="linear(135deg, rgba(36, 52, 109, 0.85) 0%, rgba(17, 25, 56, 0.95) 100%)"
        p={6}
        borderRadius="xl"
        border="1px solid"
        borderColor="border.subtle"
      >
        <VStack align="stretch" spacing={4}>
          <Text fontSize="lg" fontWeight="bold" color="text.primary">
            Property Overview
          </Text>
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text color="text.muted">Occupancy Rate</Text>
              <Text fontWeight="bold" color="text.primary">
                {safeStats.occupancyRate}%
              </Text>
            </Flex>
            <Progress value={safeStats.occupancyRate} size="lg" />
          </Box>
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text color="text.muted">Available Properties</Text>
              <Text fontWeight="bold" color="text.primary">
                {available}
              </Text>
            </Flex>
            <Progress
              value={availablePercentage}
              size="lg"
              sx={{
                "& > div": {
                  backgroundColor: "success.default",
                },
              }}
            />
          </Box>
        </VStack>
      </Box>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <Box
          bgGradient="linear(135deg, rgba(36, 52, 109, 0.85) 0%, rgba(17, 25, 56, 0.95) 100%)"
          p={6}
          borderRadius="xl"
          border="1px solid"
          borderColor="border.subtle"
        >
          <VStack align="stretch" spacing={4}>
            <Text fontSize="lg" fontWeight="bold" color="text.primary">
              Recent Activity
            </Text>
            <VStack align="stretch" spacing={3}>
              {recentActivities.map((activity) => (
                <Box
                  key={activity.id}
                  p={3}
                  bg="bg.surface"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="border.subtle"
                >
                  <Flex align="center" gap={3}>
                    <Text fontSize="lg">{getActivityIcon(activity.type)}</Text>
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="bold" color="text.primary">
                        {activity.message}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default DashboardStats;

