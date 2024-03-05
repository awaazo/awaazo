import { useEffect, useState } from 'react'
import { Button, Icon, HStack, FormControl, RadioGroup, Radio, Stack, Input, VStack, Text, Center, Box } from '@chakra-ui/react'
import { PiCurrencyDollarSimpleFill } from 'react-icons/pi'
import PaymentHelper from '../../helpers/PaymentHelper'
import { useRouter } from 'next/router'

const Tipjar = ({ episodeId, totalPoint }) => {
  const router = useRouter()
  const { success, failure } = router.query
  const [points, setPoints] = useState('')
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState('')
  const [showStack, setShowStack] = useState(true)
  const [customPoints, setCustomPoints] = useState('')

  useEffect(() => {
    const checkQueryParameter = async () => {
      if (success) {
        setShowStack(false)
        try {
          const response = await PaymentHelper.confirmPayment({ pointId: success.toString() })
          setPaymentSuccess(response.status === 200 ? 'Thank you for Supporting !' : response.data)
        } catch (error) {
          console.error('Error While Confirming the Payment', error)
        }
      } else if (failure) {
        setPaymentError('Error While Processing the Payment')
      }
    }

    checkQueryParameter()
  }, [success, failure])

  const handlePointsChange = (value) => {
    setPoints(value)
    setCustomPoints(value === 'custom' ? customPoints : '')
  }

  const handleCustomPointsChange = ({ target: { value } }) => setCustomPoints(value)

  const handleTipSubmit = async () => {
    const numericPoints = points === 'custom' ? parseFloat(customPoints) : parseInt(points, 10)
    if (!numericPoints) {
      setPaymentError('Please enter or select a points amount')
      return
    }
    const amount = numericPoints * 0.1 

    try {
      const response = await PaymentHelper.createPayment({ episodeId, points: numericPoints })
      if (response.status === 200) {
        window.location.href = response.data
        setPoints('')
        setCustomPoints('')
        console.log('Tip processed successfully')
      } else {
        setPaymentError(response.data)
        console.error('Error processing tip:', response.data)
      }
    } catch (error) {
      console.error('Error processing tip:', error)
    }
  }

  const calculateSupporterMessage = (points) => {
    if (!points) return '5 Points = 0.5 CAD'
    const numericPoints = parseFloat(points)
    const amount = numericPoints * 0.1 
    return `Thanks for supporting $${amount.toFixed(2)} CAD!`
  }

  const supporterMessage = calculateSupporterMessage(points === 'custom' ? customPoints : points)

  return (
    <>
      {showStack == false && <Text color="gray.500">{paymentSuccess}</Text>}
      {showStack == true && (
        <>
          <VStack spacing={5} align="center" p={5}>
            <Box p={3} bg="rgba(255, 255, 255, 0.08)" rounded="xl" w="full" backdropFilter="blur(10px)">
              <VStack align="left">
                <HStack align="center">
                  <Icon as={PiCurrencyDollarSimpleFill} color="brand.100" size="24px" style={{ marginBottom: '3px' }} />
                  <Text fontSize="lg" fontWeight="bold">
                    Support the Podcast
                  </Text>
                </HStack>
                <Text fontSize="sm" fontWeight="bold">
                  Select the number of points you would like to gift
                </Text>
              </VStack>
            </Box>
            {paymentError && (
              <Text fontSize="md" color="red.500">
                {paymentError}
              </Text>
            )}
            <VStack position="fixed" bottom="0" width="100%" p={'20px'}>
            <HStack justify="center" spacing={5}>
              {['5', '10', '50', 'custom'].map(value => (
                <Button 
                  key={value} 
                  onClick={() => handlePointsChange(value)}
                
                  variant={points === value ? 'gradient' : 'ghost'}
                  style={{ minWidth: "0rem" }} 
                >
                  {points === value ? ` ${value}` : value}
                </Button>
              ))}
            </HStack>
              {points === 'custom' && (
                <FormControl>
                  <Input placeholder="Enter custom points amount" value={customPoints} onChange={handleCustomPointsChange} type="number" min={1} />
                </FormControl>
              )}
              <Center w="full" justifyContent="center" alignItems="center">
                <Text textAlign="center">{supporterMessage}</Text>
              </Center>

              <Button leftIcon={<Icon as={PiCurrencyDollarSimpleFill} />} onClick={handleTipSubmit} variant="gradient" mt={5}>
                Tip Creator
              </Button>
            </VStack>
          </VStack>
        </>
      )}
    </>
  )
}
export default Tipjar
