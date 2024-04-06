import React from 'react'
import { Center, HStack, Text, VStack } from '@chakra-ui/react'
import { formatNumber } from '../../utilities/commonUtils'

type Metric = {
  value: number
  label: string
}

type MetricDisplayProps = {
  metrics: Metric[]
}

const MetricDisplay: React.FC<MetricDisplayProps> = ({ metrics }) => (
  <Center>
    <HStack spacing={4} alignItems="center">
      {metrics.map((metric, index) => (
        <React.Fragment key={index}>
          <VStack justify="center" alignItems="center" spacing={0}>
            <Text fontSize="sm" color="white" fontWeight="bold">
              {formatNumber(metric.value)}
            </Text>
            <Text fontSize="sm" color="az.red" fontWeight="bold">
              {metric.label}
            </Text>
          </VStack>
          {index < metrics.length - 1 && (
            <Text fontSize="16px" color="gray">
              |
            </Text>
          )}
        </React.Fragment>
      ))}
    </HStack>
  </Center>
)

export default MetricDisplay
