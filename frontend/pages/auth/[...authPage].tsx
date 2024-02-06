import React from "react";
import { useRouter } from "next/router";
import LoginComponent from "../../components/auth/Login";
import SignUpComponent from "../../components/auth/Signup";
import ForgotPasswordComponent from "../../components/auth/ForgotPassword";

const AuthPage = () => {
  const router = useRouter();
  const { authPage } = router.query;

  const getCurrentComponent = () => {
    switch (authPage?.[0]) {
      case "Signup":
        return <SignUpComponent />;
      case "ForgotPassword":
        return <ForgotPasswordComponent />;
      default:
        return <LoginComponent />;
    }
  };

  return <>{getCurrentComponent()}</>;
};

export default AuthPage;
