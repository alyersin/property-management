"use client";

import { useState } from "react";
import { useDisclosure, Box, Flex, Heading, HStack, Button, Icon } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

import PageLayout from "./PageLayout";
import SearchFilter from "./SearchFilter";
import DataTable from "./DataTable";
import FormModal from "./FormModal";
import DynamicForm from "./DynamicForm";
import { useAppData } from "../../hooks/useAppData";
import usePersistentState from "../../hooks/usePersistentState";
import { getFieldsByType } from "../../config/formFields";
import { FILTER_OPTIONS } from "../../utils/constants";
import { itemMatchesStatus } from "../../utils/helpers";
import ProtectedRoute from "../auth/ProtectedRoute";
import logger from "../../utils/logger";
import { STORAGE_KEYS } from "../../constants/app";
import { useAuth } from "../../contexts/AuthContext";

const UniversalPage = ({ 
  dataType, 
  title, 
  filterOptions = [],
  columns = [],
  actions = [],
  emptyMessage = "No data available",
  hidePageLayout = false
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingItem, setEditingItem] = useState(null);
  const { user } = useAuth();

  // Load page preferences from localStorage
  const storageKey = `${STORAGE_KEYS.preferences}_${dataType}`;
  const [preferences, setPreferences] = usePersistentState(storageKey, {
    filterValue: "all",
    lastUpdated: null,
  });

  const { filterValue = "all" } = preferences;

  const updatePreferences = (updates) =>
    setPreferences((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  
  const { data, loading, error, create, update, remove } = useAppData(dataType, user?.id);
  const fields = getFieldsByType(dataType);

  // Ensure data is always an array
  const safeData = Array.isArray(data) ? data : [];

  // Filter data by status only
  const filteredData = safeData.filter(item => 
    itemMatchesStatus(item, filterValue)
  );

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
      logger.data('delete', dataType, item.id);
    } catch (error) {
      logger.error(`Error deleting ${dataType}`, error);
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
      logger.error(`Error saving ${dataType}`, error);
    }
  };

  const handleClose = () => {
    onClose();
    setEditingItem(null);
  };

  // Get filter options for this data type
  const availableFilterOptions = filterOptions.length > 0 
    ? filterOptions 
    : FILTER_OPTIONS[dataType] || [];

  // Map data types to their singular forms
  const singularForm = {
    properties: 'property',
    expenses: 'expense'
  }[dataType] || dataType.slice(0, -1);

  const displayName = {
    properties: 'properties',
    expenses: 'expenses'
  }[dataType] || dataType.replace(/([A-Z])/g, ' $1').toLowerCase().trim();

  const content = (
    <>
      {availableFilterOptions.length > 0 && (
        <SearchFilter
          filterValue={filterValue}
          onFilterChange={(value) => updatePreferences({ filterValue: value })}
          filterOptions={availableFilterOptions}
        />
      )}

      <DataTable
        data={filteredData}
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
