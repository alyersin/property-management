"use client";

import { useState } from "react";
import { useDisclosure, Box, Flex, Heading, HStack, Button, Icon } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import PageLayout from "./PageLayout";
import DataTable from "./DataTable";
import FormModal from "./FormModal";
import DynamicForm from "./DynamicForm";
import { useAppData } from "../../hooks/useAppData";
import { getFieldsByType } from "../../config/formFields";
import ProtectedRoute from "../auth/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";

const UniversalPage = ({ 
  dataType, 
  title, 
  columns = [],
  actions = [],
  emptyMessage = "No data available",
  hidePageLayout = false
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const { user } = useAuth();
  
  const { data, loading, error, create, update, remove } = useAppData(dataType, user?.id);
  const fields = getFieldsByType(dataType);

  // Ensure data is always an array - no filtering applied
  const displayData = Array.isArray(data) ? data : [];

  const handleAdd = () => {
    setEditingItem(null);
    onOpen();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    onOpen();
  };

  const handleDelete = async (item) => {
    try {
      await remove(item.id);
      if (process.env.NODE_ENV === 'development') {
        console.log(`[DATA] delete ${dataType} (ID: ${item.id})`);
      }
    } catch (error) {
      console.error(`[ERROR] Error deleting ${dataType}`, error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await update(editingItem.id, formData);
      } else {
        await create(formData);
      }
      onClose();
      setEditingItem(null);
    } catch (error) {
      console.error(`[ERROR] Error saving ${dataType}`, error);
    }
  };

  const handleClose = () => {
    onClose();
    setEditingItem(null);
  };

  // Map data types to their singular forms
  const singularForm = {
    properties: 'property',
    tenants: 'tenant'
  }[dataType] || dataType.slice(0, -1);

  const displayName = {
    properties: 'properties',
    tenants: 'tenants'
  }[dataType] || dataType.replace(/([A-Z])/g, ' $1').toLowerCase().trim();

  const content = (
    <>
      <DataTable
        data={displayData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={loading}
        emptyMessage={emptyMessage}
      />

      <FormModal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingItem ? `Edit ${singularForm}` : `Add ${singularForm}`}
        onSubmit={handleSubmit}
      >
        <DynamicForm
          fields={fields}
          values={editingItem || {}}
          onChange={() => {}} // Handled by DynamicForm internally
          onSubmit={handleSubmit}
          onCancel={handleClose}
          submitLabel={editingItem ? "Update" : "Create"}
          cancelLabel="Cancel"
          isLoading={loading}
        />
      </FormModal>
    </>
  );

  if (hidePageLayout) {
    return (
      <ProtectedRoute>
        <Box>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="lg" color="accent.emphasis" fontWeight="700">
              {title}
            </Heading>
            <HStack spacing={4}>
              <Button
                size="sm"
                leftIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Add {singularForm}
              </Button>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || "outline"}
                  leftIcon={action.icon ? <Icon as={action.icon} boxSize={4} /> : undefined}
                  onClick={action.onClick}
                >
                  {action.label}
                </Button>
              ))}
            </HStack>
          </Flex>
          {content}
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout
        title={title}
        actions={[
          { label: `Add ${singularForm}`, icon: AddIcon, onClick: handleAdd },
          ...actions
        ]}
      >
        {content}
      </PageLayout>
    </ProtectedRoute>
  );
};

export default UniversalPage;
