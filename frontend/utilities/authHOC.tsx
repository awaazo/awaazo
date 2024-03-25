// authHOC.tsx
import React, { useEffect, useState } from "react";
import router from "next/router";
import AuthHelper from "../helpers/AuthHelper";
import { Spinner } from "@chakra-ui/react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const response = await AuthHelper.authMeRequest();
        if (response.status === 401) {
          router.replace("/auth/Login");
        } else {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, []);

    if (isLoading) {
      return <Spinner />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
