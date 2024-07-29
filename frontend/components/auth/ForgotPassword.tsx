import React, { useState } from 'react'
import { Button, FormControl, Input, Stack, Text, useToast, Container, Img, VStack } from '@chakra-ui/react'
import Logo from '../../public/logos/logo_white.svg'
import { useTranslation } from 'react-i18next'
import AuthHelper from '../../helpers/AuthHelper'

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const toast = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const response = await AuthHelper.forgotPassword(email)

      if (response && response.status === 200) {
        const message = response.data || t("auth.resetLinkSent")
        toast({
          title: t("auth.resetLinkSentTitle"),
          description: message,
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      } else {
        throw new Error(t("auth.failedToSendResetLink"))
      }
    } catch (error) {
      let errorMessage = t("auth.emailNotAssociated")
      if (error.response) {
        errorMessage = error.response.data || errorMessage
      }

      toast({
        title: t("auth.error"),
        description: errorMessage,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Container padding={'30px'} display="inline-flex" flexDirection="column" alignItems="center" gap="30px" border-radius="20px">
        <Img src={Logo.src} alt="logo" style={{ maxWidth: '45px' }} />
        <VStack display="flex" flex-direction="column" align-items="center" spacing={1} >
          <VStack align="flex-start" gap="8px" width={'323px'} flexDirection="column" mb={"16px"}>
            <Text fontSize="xl" fontWeight="bold" color="white" textAlign="left">
              {t("auth.forgotPassword")}
            </Text>
            <Text fontSize="xs" color="az.greyish"  textAlign="left">
              {t("auth.forgotPasswordDescription")}
            </Text>
          </VStack>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack spacing={4}>
              <FormControl id="email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.enterEmail")}
                  required
                />
              </FormControl>
              <Button variant="large" type="submit"  >
                {t("auth.sendResetLink")}
              </Button>
            </Stack>
          </form>
        </VStack>
      </Container>
    </>
  )
}

export default ForgotPassword
