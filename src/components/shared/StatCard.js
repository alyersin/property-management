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
  trend,
}) {
  return (
    <Card>
      <CardBody>
        <Stat>
          <StatLabel>{label}</StatLabel>
          <StatNumber color={color}>{value}</StatNumber>
          <StatHelpText>
            {arrowType && <StatArrow type={arrowType} />}
            {helpText}
          </StatHelpText>
        </Stat>
      </CardBody>
    </Card>
  );
}
