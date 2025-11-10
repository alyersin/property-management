"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";

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
      Active: "green",
      Occupied: "green",
      Available: "blue",
      Renovating: "orange",
      Completed: "green",
      Pending: "yellow",
      Paid: "green",
      Overdue: "red",
      Prospective: "purple",
    };
    return colors[status] || "gray";
  };

  if (isLoading) {
    return (
      <Box
        p={6}
        textAlign="center"
        bgGradient="linear(160deg, rgba(30, 45, 99, 0.85) 0%, rgba(16, 23, 52, 0.95) 100%)"
        borderRadius="xl"
        border="1px solid"
        borderColor="border.subtle"
      >
        <Text color="text.muted">Loading...</Text>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box
        p={6}
        textAlign="center"
        bgGradient="linear(160deg, rgba(30, 45, 99, 0.85) 0%, rgba(16, 23, 52, 0.95) 100%)"
        borderRadius="xl"
        border="1px solid"
        borderColor="border.subtle"
      >
        <Text color="text.muted">{emptyMessage}</Text>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <VStack spacing={4} align="stretch">
        {data.map((item, index) => (
          <Box
            key={item.id || index}
            bgGradient="linear(160deg, rgba(36, 52, 109, 0.85) 0%, rgba(17, 25, 56, 0.95) 100%)"
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor="border.subtle"
          >
            <VStack align="stretch" spacing={3}>
              {columns.slice(0, 3).map((column) => (
                <Box key={column.key}>
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="text.soft"
                    mb={1}
                  >
                    {column.label}
                  </Text>
                  <Box color="text.primary">
                    {column.key === "status" ? (
                      <Badge colorScheme={getStatusColor(item[column.key])}>
                        {item[column.key]}
                      </Badge>
                    ) : column.key === "amount" ? (
                      <Text
                        color={
                          item[column.key] >= 0
                            ? "success.default"
                            : "danger.default"
                        }
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
                  <Divider borderColor="border.subtle" />
                  <HStack justify="space-between" w="full">
                    <HStack spacing={2}>
                      {onView && (
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => onView(item)}
                        >
                          View
                        </Button>
                      )}
                      {onEdit && (
                        <Button size="xs" onClick={() => onEdit(item)}>
                          Edit
                        </Button>
                      )}
                    </HStack>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<HamburgerIcon />}
                        size="xs"
                        variant="ghost"
                      />
                      <MenuList>
                        {actions.map((action, actionIndex) => (
                          <MenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                          >
                            {action.label}
                          </MenuItem>
                        ))}
                        {onDelete && (
                          <MenuItem
                            color="danger.default"
                            onClick={() => handleDelete(item)}
                          >
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

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay bg="bg.overlay">
            <AlertDialogContent bg="bg.surfaceAlt">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Item
              </AlertDialogHeader>
              <AlertDialogBody color="text.muted">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} variant="outline">
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
      <Box
        bgGradient="linear(160deg, rgba(30, 45, 99, 0.85) 0%, rgba(16, 23, 52, 0.95) 100%)"
        borderRadius="xl"
        border="1px solid"
        borderColor="border.subtle"
        overflow="hidden"
      >
        <Table variant="simple" {...props}>
          <Thead>
            <Tr>
              {columns.map((column) => (
                <Th
                  key={column.key}
                  textAlign={column.align || "left"}
                  fontSize="sm"
                  textTransform="uppercase"
                  letterSpacing="widest"
                  color="text.soft"
                  bg="bg.surface"
                >
                  {column.label}
                </Th>
              ))}
              {(onEdit || onDelete || onView || actions.length > 0) && (
                <Th
                  textAlign="right"
                  fontSize="sm"
                  textTransform="uppercase"
                  letterSpacing="widest"
                  color="text.soft"
                  bg="bg.surface"
                >
                  Actions
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, index) => (
              <Tr
                key={item.id || index}
                _hover={{ bg: "rgba(91, 124, 255, 0.1)" }}
                transition="background 0.2s ease"
              >
                {columns.map((column) => (
                  <Td key={column.key} textAlign={column.align || "left"}>
                    {column.key === "status" ? (
                      <Badge colorScheme={getStatusColor(item[column.key])}>
                        {item[column.key]}
                      </Badge>
                    ) : column.key === "amount" ? (
                      <Text
                        color={
                          item[column.key] >= 0
                            ? "success.default"
                            : "danger.default"
                        }
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
                        {actions.map((action, actionIndex) => (
                          <MenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(item)}
                          >
                            {action.label}
                          </MenuItem>
                        ))}
                        {onDelete && (
                          <MenuItem
                            onClick={() => handleDelete(item)}
                            color="danger.default"
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
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay bg="bg.overlay">
          <AlertDialogContent bg="bg.surfaceAlt">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Item
            </AlertDialogHeader>
            <AlertDialogBody color="text.muted">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} variant="outline">
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
