import React, { useEffect, useState } from "react";
import { Button, Tooltip, Icon } from "@chakra-ui/react";
import { usePanel } from "../../../utilities/PanelContext";
import { PiCurrencyDollarSimpleFill } from 'react-icons/pi';
import AuthPrompt from "../../auth/AuthPrompt";
import AuthHelper from "../../../helpers/AuthHelper";
import { useRouter } from "next/router";

const TipjarButton = ({ episodeId , totalPoint }) => {
  const { dispatch } = usePanel();
  const router = useRouter()
  const { success, failure } = router.query
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);


  useEffect(() => {
    const checkQueryParameter = async () => {
      if (success) {
       
        try {
          dispatch({ type: "OPEN_PANEL", payload: "Tipjar" });
          dispatch({ type: "SET_EPISODE_ID", payload: episodeId });

        } catch (error) {
          console.error('Error While Confirming the Payment', error)
        }
      } else if (failure) {
        dispatch({ type: "OPEN_PANEL", payload: "Tipjar" });
        dispatch({ type: "SET_EPISODE_ID", payload: episodeId });
      }
    }

    checkQueryParameter()
  }, [success, failure])
  const handleClick = async () => {
    try {
      const response = await AuthHelper.authMeRequest();
      if (response.status === 401) {
        setShowLoginPrompt(true);
        return;
      }
      dispatch({ type: "OPEN_PANEL", payload: "Tipjar" });
      dispatch({ type: "SET_EPISODE_ID", payload: episodeId });
    } catch (error) {
      console.error("Error handling click:", error);
    }
  };

  return (
    <>
      <Tooltip label="Tipjar" aria-label="Tipjar">
        <Button padding={"0px"} variant={"ghost"} onClick={handleClick}>
          <Icon as={PiCurrencyDollarSimpleFill} size="80px" />
          {totalPoint}
        </Button>
      </Tooltip>
      {showLoginPrompt && (
        <AuthPrompt
          isOpen={showLoginPrompt}
          onClose={() => setShowLoginPrompt(false)}
          infoMessage="Login to send tips"
        />
      )}
    </>
  );
};

export default TipjarButton;
