"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useBreakpointValue,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";

const DataTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  onView,
  actions = [],
  isLoading = false,
  emptyMessage = "No data available",
  ...props
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleDelete = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  const confirmDelete = () => {
    if (selectedItem && onDelete) {
      onDelete(selectedItem);
    }
    onClose();
    setSelectedItem(null);
  };

  const getCellValue = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return item[column.key];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'green',
      'Occupied': 'green',
      'Available': 'blue',
      'Renovating': 'orange',
      'Completed': 'green',
      'Pending': 'yellow',
      'Paid': 'green',
      'Overdue': 'red',
      'Prospective': 'purple'
    };
    return colors[status] || 'gray';
  };

  if (isLoading) {
    return (
      <Box p={4} textAlign="center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color="gray.500">{emptyMessage}</Text>
      </Box>
    );
  }

  // Mobile Card View
  if (isMobile) {
    return (
      <VStack spacing={4} align="stretch">
        {data.map((item, index) => (
          <Box key={index} bg="white" p={4} borderRadius="md" shadow="sm" border="1px" borderColor="gray.200">
            <VStack align="stretch" spacing={3}>
              {columns.slice(0, 3).map((column) => (
                <Box key={column.key}>
                  <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={1}>
                    {column.label}:
                  </Text>
                  <Box>
                    {column.key === 'status' ? (
                      <Badge colorScheme={getStatusColor(item[column.key])}>
                        {item[column.key]}
                      </Badge>
                    ) : column.key === 'amount' ? (
                      <Text
                        color={item[column.key] >= 0 ? 'green.500' : 'red.500'}
                        fontWeight="bold"
                      >
                        ${Math.abs(item[column.key]).toLocaleString()}
                      </Text>
                    ) : (
                      getCellValue(item, column)
                    )}
                  </Box>
                </Box>
              ))}
              
              {(onEdit || onDelete || onView || actions.length > 0) && (
                <>
                  <Divider />
                  <HStack justify="space-between">
                    <HStack spacing={2}>
                      {onView && (
                        <Button size="xs" variant="outline" onClick={() => onView(item)}>
                          View
                        </Button>
                      )}
                      {onEdit && (
                        <Button size="xs" colorScheme="blue" onClick={() => onEdit(item)}>
                          Edit
                        </Button>
                      )}
                    </HStack>
                    
                    <Menu>
                      <MenuButton as={IconButton} icon={<HamburgerIcon />} size="xs" variant="ghost" />
                      <MenuList>
                        {actions.map((action, actionIndex) => (
                          <MenuItem key={actionIndex} onClick={() => action.onClick(item)}>
                            {action.label}
                          </MenuItem>
                        ))}
                        {onDelete && (
                          <MenuItem color="red.500" onClick={() => handleDelete(item)}>
                            Delete
                          </MenuItem>
                        )}
                      </MenuList>
                    </Menu>
                  </HStack>
                </>
              )}
            </VStack>
          </Box>
        ))}
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Item
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this item? This action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    );
  }

  return (
    <>
      <Table variant="simple" {...props}>
        <Thead>
          <Tr>
            {columns.map((column) => (
              <Th key={column.key} textAlign={column.align || 'left'}>
                {column.label}
              </Th>
            ))}
            {(onEdit || onDelete || onView || actions.length > 0) && (
              <Th textAlign="right">Actions</Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={item.id || index}>
              {columns.map((column) => (
                <Td key={column.key} textAlign={column.align || 'left'}>
                  {column.key === 'status' ? (
                    <Badge colorScheme={getStatusColor(item[column.key])}>
                      {item[column.key]}
                    </Badge>
                  ) : column.key === 'amount' ? (
                    <Text
                      color={item[column.key] >= 0 ? 'green.500' : 'red.500'}
                      fontWeight="bold"
                    >
                      ${Math.abs(item[column.key]).toLocaleString()}
                    </Text>
                  ) : (
                    getCellValue(item, column)
                  )}
                </Td>
              ))}
              {(onEdit || onDelete || onView || actions.length > 0) && (
                <Td textAlign="right">
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<HamburgerIcon />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      {onView && (
                        <MenuItem onClick={() => onView(item)}>
                          View Details
                        </MenuItem>
                      )}
                      {onEdit && (
                        <MenuItem onClick={() => onEdit(item)}>
                          Edit
                        </MenuItem>
                      )}
                      {actions.map((action, index) => (
                        <MenuItem key={index} onClick={() => action.onClick(item)}>
                          {action.label}
                        </MenuItem>
                      ))}
                      {onDelete && (
                        <MenuItem
                          onClick={() => handleDelete(item)}
                          color="red.500"
                        >
                          Delete
                        </MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Item
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DataTable;
