import React from "react";
import { useRouter } from "next/router";
import Login from "../../components/auth/Login";
import SignUp from "../../components/auth/Signup";
import ForgotPassword from "../../components/auth/ForgotPassword";

const AuthPage = () => {
  const router = useRouter();
  const { authPage } = router.query;

  const getCurrentComponent = () => {
    const components = {
      "Signup": <SignUp />,
      "ForgotPassword": <ForgotPassword />,
      "Login": <Login />
    };
    return components[authPage?.[0]] || components["Login"];
  };

  return getCurrentComponent();
};

export default AuthPage;
