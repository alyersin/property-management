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
import StatCard from "./StatCard";

const DashboardStats = ({ stats, recentActivities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      payment: "💰",
      tenant: "👥",
      expense: "💸",
      property: "🏠",
    };
    return icons[type] || "📊";
  };

  const getActivityColor = (type) => {
    const colors = {
      payment: "green",
      tenant: "blue",
      expense: "orange",
      property: "purple",
    };
    return colors[type] || "gray";
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          label="Total Properties"
          value={stats.totalProperties}
          helpText={`${stats.occupiedProperties} occupied`}
          color="blue.500"
          arrowType="increase"
        />
        <StatCard
          label="Monthly Income"
          value={`$${stats.monthlyIncome.toLocaleString()}`}
          helpText="This month"
          color="green.500"
          arrowType="increase"
        />
        <StatCard
          label="Monthly Expenses"
          value={`$${stats.monthlyExpenses.toLocaleString()}`}
          helpText="This month"
          color="red.500"
          arrowType="decrease"
        />
        <StatCard
          label="Net Income"
          value={`$${stats.netIncome.toLocaleString()}`}
          helpText="This month"
          color={stats.netIncome > 0 ? "green.500" : "red.500"}
          arrowType={stats.netIncome > 0 ? "increase" : "decrease"}
        />
      </SimpleGrid>

      {/* Property Overview */}
      <Box bg="white" p={6} borderRadius="lg" shadow="sm">
        <VStack align="stretch" spacing={4}>
          <Text fontSize="lg" fontWeight="bold">
            Property Overview
          </Text>
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text>Occupancy Rate</Text>
              <Text fontWeight="bold">{stats.occupancyRate}%</Text>
            </Flex>
            <Progress
              value={stats.occupancyRate}
              colorScheme="blue"
              size="lg"
            />
          </Box>
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text>Available Properties</Text>
              <Text fontWeight="bold">
                {stats.totalProperties - stats.occupiedProperties}
              </Text>
            </Flex>
            <Progress
              value={((stats.totalProperties - stats.occupiedProperties) / stats.totalProperties) * 100}
              colorScheme="green"
              size="lg"
            />
          </Box>
        </VStack>
      </Box>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
          <VStack align="stretch" spacing={4}>
            <Text fontSize="lg" fontWeight="bold">
              Recent Activity
            </Text>
            <VStack align="stretch" spacing={3}>
              {recentActivities.map((activity) => (
                <Box key={activity.id} p={3} bg="gray.50" borderRadius="md">
                  <Flex align="center" gap={3}>
                    <Text fontSize="lg">{getActivityIcon(activity.type)}</Text>
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="bold">
                        {activity.message}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {activity.time}
                      </Text>
                      {activity.amount && (
                        <Text
                          fontSize="xs"
                          color="green.500"
                          fontWeight="bold"
                        >
                          +${activity.amount.toLocaleString()}
                        </Text>
                      )}
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
