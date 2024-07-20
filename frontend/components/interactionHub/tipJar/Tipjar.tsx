import { useEffect, useState } from 'react'
import { Button, Icon, HStack, FormControl, RadioGroup, Radio, Stack, Input, VStack, Text, Center, Box } from '@chakra-ui/react'
import { PiCurrencyDollarSimpleFill } from 'react-icons/pi'
import PaymentHelper from '../../../helpers/PaymentHelper'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const Tipjar = ({ episodeId, totalPoint }) => {
  const { t } = useTranslation()
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
          setPaymentSuccess(response.status === 200 ? t('tipjar.thank_you_for_supporting') : response.data)
        } catch (error) {
          console.error('Error While Confirming the Payment', error)
        }
      } else if (failure) {
        setPaymentError(t('tipjar.error_processing_payment'))
      }
    }

    checkQueryParameter()
  }, [success, failure, t])

  const handlePointsChange = (value) => {
    setPoints(value)
    setCustomPoints(value === 'custom' ? customPoints : '')
  }

  const handleCustomPointsChange = ({ target: { value } }) => setCustomPoints(value)

  const handleTipSubmit = async () => {
    const numericPoints = points === 'custom' ? parseFloat(customPoints) : parseInt(points, 10)
    if (!numericPoints) {
      setPaymentError(t('tipjar.enter_or_select_points'))
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
    if (!points) return t('tipjar.default_supporter_message')
    const numericPoints = parseFloat(points)
    const amount = numericPoints * 0.1
    return t('tipjar.supporter_message', { amount: amount.toFixed(2) })
  }

  const supporterMessage = calculateSupporterMessage(points === 'custom' ? customPoints : points)

  return (
    <>
      {showStack == false && <Text color="gray.500">{paymentSuccess}</Text>}
      {showStack == true && (
        <>
          <VStack spacing={5} align="center" p={5}>
            <Box p={3} bg="rgba(255, 255, 255, 0.08)" rounded="xl" w="full">
              <VStack align="left">
                <HStack align="center">
                  <Icon as={PiCurrencyDollarSimpleFill} color="az.red" size="24px" style={{ marginBottom: '3px' }} />
                  <Text fontSize="lg" fontWeight="bold">
                    {t('tipjar.support_the_podcast')}
                  </Text>
                </HStack>
                <Text fontSize="sm" fontWeight="bold">
                  {t('tipjar.select_points')}
                </Text>
              </VStack>
            </Box>
            {paymentError && (
              <Text fontSize="md" color="red.500">
                {paymentError}
              </Text>
            )}
            <VStack position="relative" width="100%" p={'20px'}>
              <HStack justify="center" spacing={5}>
                {['5', '10', '50', 'custom'].map((value) => (
                  <Button key={value} onClick={() => handlePointsChange(value)} bg={points === value ? 'az.red' : 'none'} borderRadius={'50px'} style={{ minWidth: '0rem' }}>
                    {points === value ? ` ${value}` : value}
                  </Button>
                ))}
              </HStack>
              {points === 'custom' && (
                <FormControl>
                  <Input placeholder={t('tipjar.enter_custom_points')} value={customPoints} onChange={handleCustomPointsChange} type="number" min={1} />
                </FormControl>
              )}
              <Center w="full" justifyContent="center" alignItems="center">
                <Text textAlign="center">{supporterMessage}</Text>
              </Center>

              <Button leftIcon={<Icon as={PiCurrencyDollarSimpleFill} />} onClick={handleTipSubmit} bg="az.red" borderRadius={'10px'} mt={5}>
                {t('tipjar.tip_creator')}
              </Button>
            </VStack>
          </VStack>
        </>
      )}
    </>
  )
}
export default Tipjar
