import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, FormControl, Input, Stack, Container, Flex, Img, Text, useToast, InputGroup, InputRightElement, IconButton, Alert, AlertDescription } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import AuthHelper from '../../helpers/AuthHelper';
import Logo from "../../public/logos/logo_white.svg";
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { token, email } = router.query;
  
  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: t('error'),
        description: t("auth.passwordsDontMatch"),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (!token || !email) {
      toast({
        title: t('error'),
        description: t("auth.missingTokenOrEmail"),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await AuthHelper.resetPassword({
        email: email.toString(),
        token: token.toString(),
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });

      if (response.status === 200) {
        toast({
          title: t('success'),
          description: t('auth.passwordResetSuccess'),
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        window.location.href = 'auth/Login'; // Redirect to login page
      } else {
        toast({
          title: t('error'),
          description: response.message || t('auth.passwordResetFailed'),
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: t('auth.passwordResetFailed'),
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Container variant={"authBox"}> {/* Adjust the variant as needed */}
        <Flex justifyContent="center" mb={4}>
          <Img src={Logo.src} alt="logo" style={{ maxWidth: "45px" }} />
        </Flex>
        <Text fontSize="lg" fontWeight="bold" color="white" align={"center"} textColor={"brand.300"}>
          {t('auth.resetYourPassword')}
        </Text>
        <Text fontSize="sm" color="gray.400" mb={6} align={"center"}>
          {t('auth.enterNewPassword')}
        </Text>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="password">
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.newPassword')}
                  borderRadius="2xl"
                  bg="whiteAlpha.200"
                  borderColor="whiteAlpha.400"
                  _placeholder={{ color: "whiteAlpha.700" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputRightElement>
                  <IconButton
                    bg="transparent"
                    variant="ghost"
                    aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={handlePasswordVisibility}
                    borderRadius="3xl"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl id="confirmPassword">
              <Input
                type="password"
                placeholder={t('auth.confirmNewPassword')}
                borderRadius="2xl"
                bg="whiteAlpha.200"
                borderColor="whiteAlpha.400"
                _placeholder={{ color: "whiteAlpha.700" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormControl>
            <Button
              type="submit"
              color="white"
              bg="brand.100"
              size="md"
              fontSize="md"
              borderRadius="2xl"
              py={3}
              boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
            >
              {t('auth.resetPassword')}
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
};

export default ResetPassword;
