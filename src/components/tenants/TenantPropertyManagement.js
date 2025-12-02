"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Box,
  useToast,
  Badge
} from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";

const TenantPropertyManagement = ({ tenantId, tenantName, isOpen, onClose }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [tenantProperties, setTenantProperties] = useState([]);

  // Fetch tenant properties
  useEffect(() => {
    if (isOpen && tenantId && user?.id) {
      fetchData();
    }
  }, [isOpen, tenantId, user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch current tenant properties
      const propertiesRes = await fetch(`/api/tenants/${tenantId}/properties?userId=${user.id}`);
      const propertiesData = await propertiesRes.json();
      setTenantProperties(propertiesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="bg.surfaceAlt" borderColor="border.subtle">
        <ModalHeader color="text.primary">
          Properties - {tenantName}
        </ModalHeader>
        <ModalCloseButton color="text.muted" />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            {loading ? (
              <Text color="text.muted" fontSize="sm" textAlign="center">
                Loading...
              </Text>
            ) : tenantProperties.length === 0 ? (
              <Text color="text.muted" fontSize="sm" textAlign="center">
                This tenant is not assigned to any properties
              </Text>
            ) : (
              <VStack spacing={2} align="stretch">
                {tenantProperties.map((property) => (
                  <Box
                    key={property.id}
                    p={4}
                    bg="bg.surface"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="border.subtle"
                  >
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text fontWeight="bold" color="text.primary" fontSize="lg">
                          {property.city}
                        </Text>
                        <Badge colorScheme={property.status === 'Occupied' ? 'green' : property.status === 'Available' ? 'blue' : 'orange'}>
                          {property.status}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="text.muted">
                        {property.bedrooms} bed, {property.bathrooms} bath
                      </Text>
                      {(property.start_date || property.end_date) && (
                        <HStack mt={2} spacing={2}>
                          {property.start_date && (
                            <Badge colorScheme="blue" fontSize="xs">
                              From: {new Date(property.start_date).toLocaleDateString()}
                            </Badge>
                          )}
                          {property.end_date && (
                            <Badge colorScheme="orange" fontSize="xs">
                              To: {new Date(property.end_date).toLocaleDateString()}
                            </Badge>
                          )}
                        </HStack>
                      )}
                    </VStack>
                  </Box>
                ))}
              </VStack>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TenantPropertyManagement;

