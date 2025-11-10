"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Flex,
  Button,
} from "@chakra-ui/react";

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  size = "xl",
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay bg="bg.overlay" backdropFilter="blur(8px)" />
      <ModalContent
        bgGradient="linear(160deg, rgba(36, 52, 109, 0.9) 0%, rgba(17, 25, 56, 0.96) 100%)"
        border="1px solid"
        borderColor="border.subtle"
      >
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
