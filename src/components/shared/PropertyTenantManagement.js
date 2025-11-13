"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Select,
  Input,
  FormControl,
  FormLabel,
  useToast,
  IconButton,
  Flex,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useRef } from "react";

const PropertyTenantManagement = ({ propertyId, propertyCity, isOpen, onClose, onUpdate }) => {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [propertyTenants, setPropertyTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tenantToRemove, setTenantToRemove] = useState(null);

  // Fetch all tenants and current property tenants
  useEffect(() => {
    if (isOpen && propertyId && user?.id) {
      fetchData();
    }
  }, [isOpen, propertyId, user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all tenants
      const tenantsRes = await fetch(`/api/tenants?userId=${user.id}`);
      const tenantsData = await tenantsRes.json();
      setTenants(tenantsData || []);

      // Fetch current property tenants
      const propertyTenantsRes = await fetch(`/api/properties/${propertyId}/tenants?userId=${user.id}`);
      const propertyTenantsData = await propertyTenantsRes.json();
      setPropertyTenants(propertyTenantsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load tenants",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedTenantId) {
      toast({
        title: "Error",
        description: "Please select a tenant",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check if tenant is already assigned
    if (propertyTenants.some(pt => pt.id === parseInt(selectedTenantId))) {
      toast({
        title: "Error",
        description: "This tenant is already assigned to this property",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${propertyId}/tenants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          tenantId: parseInt(selectedTenantId),
          start_date: startDate || null,
          end_date: endDate || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign tenant");
      }

      toast({
        title: "Success",
        description: "Tenant assigned successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setSelectedTenantId("");
      setStartDate("");
      setEndDate("");

      // Refresh data
      await fetchData();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error assigning tenant:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign tenant",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveClick = (tenantId) => {
    setTenantToRemove(tenantId);
    onDeleteOpen();
  };

  const handleRemoveConfirm = async () => {
    if (!tenantToRemove) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${propertyId}/tenants`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          tenantId: tenantToRemove,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove tenant");
      }

      toast({
        title: "Success",
        description: "Tenant removed successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh data
      await fetchData();
      if (onUpdate) onUpdate();
      
      onDeleteClose();
      setTenantToRemove(null);
    } catch (error) {
      console.error("Error removing tenant:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove tenant",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get available tenants (not already assigned)
  const availableTenants = tenants.filter(
    tenant => !propertyTenants.some(pt => pt.id === tenant.id)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="bg.surfaceAlt" borderColor="border.subtle">
        <ModalHeader color="text.primary">
          Manage Tenants - {propertyCity}
        </ModalHeader>
        <ModalCloseButton color="text.muted" />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Current Tenants */}
            <Box>
              <Text fontSize="md" fontWeight="bold" color="text.primary" mb={3}>
                Current Tenants ({propertyTenants.length})
              </Text>
              {propertyTenants.length === 0 ? (
                <Text color="text.muted" fontSize="sm">
                  No tenants assigned to this property
                </Text>
              ) : (
                <VStack spacing={2} align="stretch">
                  {propertyTenants.map((pt) => (
                    <Flex
                      key={pt.id}
                      justify="space-between"
                      align="center"
                      p={3}
                      bg="bg.surface"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="border.subtle"
                    >
                      <Box>
                        <Text fontWeight="bold" color="text.primary">
                          {pt.name}
                        </Text>
                        {pt.email && (
                          <Text fontSize="sm" color="text.muted">
                            {pt.email}
                          </Text>
                        )}
                        {(pt.start_date || pt.end_date) && (
                          <HStack mt={1} spacing={2}>
                            {pt.start_date && (
                              <Badge colorScheme="blue" fontSize="xs">
                                From: {new Date(pt.start_date).toLocaleDateString()}
                              </Badge>
                            )}
                            {pt.end_date && (
                              <Badge colorScheme="orange" fontSize="xs">
                                To: {new Date(pt.end_date).toLocaleDateString()}
                              </Badge>
                            )}
                          </HStack>
                        )}
                      </Box>
                      <IconButton
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleRemoveClick(pt.id)}
                        isLoading={loading}
                        aria-label="Remove tenant"
                      />
                    </Flex>
                  ))}
                </VStack>
              )}
            </Box>

            {/* Assign New Tenant */}
            {availableTenants.length > 0 && (
              <Box>
                <Text fontSize="md" fontWeight="bold" color="text.primary" mb={3}>
                  Assign New Tenant
                </Text>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel color="text.primary">Select Tenant</FormLabel>
                    <Select
                      value={selectedTenantId}
                      onChange={(e) => setSelectedTenantId(e.target.value)}
                      bg="bg.surface"
                      borderColor="border.subtle"
                      color="text.primary"
                      placeholder="Choose a tenant"
                    >
                      {availableTenants.map((tenant) => (
                        <option key={tenant.id} value={tenant.id} style={{ background: "#111C44" }}>
                          {tenant.name} {tenant.email && `(${tenant.email})`}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <HStack spacing={4}>
                    <FormControl>
                      <FormLabel color="text.primary" fontSize="sm">
                        Start Date (Optional)
                      </FormLabel>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        bg="bg.surface"
                        borderColor="border.subtle"
                        color="text.primary"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color="text.primary" fontSize="sm">
                        End Date (Optional)
                      </FormLabel>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        bg="bg.surface"
                        borderColor="border.subtle"
                        color="text.primary"
                      />
                    </FormControl>
                  </HStack>

                  <Button
                    onClick={handleAssign}
                    isLoading={loading}
                    colorScheme="blue"
                    width="full"
                  >
                    Assign Tenant
                  </Button>
                </VStack>
              </Box>
            )}

            {availableTenants.length === 0 && tenants.length > 0 && (
              <Text color="text.muted" fontSize="sm" textAlign="center">
                All tenants are already assigned to this property
              </Text>
            )}

            {tenants.length === 0 && (
              <Text color="text.muted" fontSize="sm" textAlign="center">
                No tenants available. Please create a tenant first.
              </Text>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="bg.surfaceAlt">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="text.primary">
              Remove Tenant
            </AlertDialogHeader>
            <AlertDialogBody color="text.muted">
              Are you sure you want to remove this tenant from the property? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose} variant="outline">
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleRemoveConfirm} ml={3} isLoading={loading}>
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Modal>
  );
};

export default PropertyTenantManagement;

