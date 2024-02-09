import React from "react";
import { useRouter } from "next/router";
import Login from "../../components/auth/Login";
import SignUp from "../../components/auth/Signup";
import ForgotPassword from "../../components/auth/ForgotPassword";
import ResetPassword from "../../components/auth/ResetPassword";
import { Flex } from "@chakra-ui/react";

const AuthPage = () => {
  const router = useRouter();
  const { authPage } = router.query;

  const getCurrentComponent = () => {
    const components = {
      "Signup": <SignUp />,
      "ForgotPassword": <ForgotPassword />,
      "Login": <Login />,
      "ResetPassword": <ResetPassword /> 
    };
    return components[authPage?.[0]] || components["Login"];
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center">
      {getCurrentComponent()}
    </Flex>
  );
};

export default AuthPage;
