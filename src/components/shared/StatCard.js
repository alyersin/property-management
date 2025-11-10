"use client";

import {
  Card,
  CardBody,
  VStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";

export default function StatCard({
  label,
  value,
  helpText,
  arrowType,
  color,
}) {
  return (
    <Card
      borderColor="border.subtle"
      bgGradient="linear(135deg, rgba(43, 62, 125, 0.85) 0%, rgba(24, 33, 71, 0.95) 100%)"
    >
      <CardBody>
        <Stat>
          <StatLabel color="text.soft">{label}</StatLabel>
          <StatNumber color={color || "text.primary"} fontWeight="700">
            {value}
          </StatNumber>
          <StatHelpText color="text.muted">
            {arrowType && <StatArrow type={arrowType} />}
            {helpText}
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );
}
