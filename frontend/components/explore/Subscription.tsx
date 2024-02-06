import React, { useState, useEffect } from "react";
import SubscribeHelper from "../../helpers/SubscribeHelper";
import { Button, Tooltip } from "@chakra-ui/react";
import { BaseResponse } from "../../types/Responses";

import LoginPrompt from "../auth/LoginPrompt";

const subscribeComponent = ({ PodcastId, initialIsSubscribed, podcasterId, currentUserID }) => {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  useEffect(() => {
    SubscribeHelper.getIsSubscribed(PodcastId)
      .then((isSubscribed) => {
        setIsSubscribed(isSubscribed);
      })
      .catch((error) => {
        console.error("Error checking subscription status:", error.message);
      });
  }, [PodcastId]);

  // Function to handle the subscribe/unsubscribe action
  const handleSubscribe = () => {
    // Toggle the subscribe status based on whether the podcast is currently subscribed
    if (isSubscribed) {
      // Call unsubscribePodcast because the podcast is currently subscribed
      SubscribeHelper.addUnsubscription(PodcastId)
      .then((response) => {
        if (response.status === 200) {
          // Update the UI to reflect the unsubscribe
          setIsSubscribed(false);
        } else {
          console.error("Error unsubscribing podcast:", response.message);
          }
        })
        .catch((error) => {
          console.error(
            "Exception when calling unsubscribePodcast:",
            error.message,
          );
        });
    } else {
      // Call subscribePodcast because the podcast is currently not subscribed
      SubscribeHelper.addSubscription(PodcastId)
        .then((response: BaseResponse) => {
          if (response.status === 200) {
            // Update the UI to reflect the subscribe
            setIsSubscribed(true);
            
          } else if (response.status === 401) {
            setShowLoginPrompt(true);
          } else {
            console.error(
              "Error subscribing podcast. Server returned status:",
              response.status,
            );
            if (response.message) {
              console.error("Error message:", response.message);
            }
          }
        })
        .catch((error) => {
          console.error(
            "Exception when calling subscribePodcast:",
            error.message,
          );
        });
      }
    };
    if (podcasterId === currentUserID) {
      return null;
    }
  return (
    <>
    <Tooltip
        label={isSubscribed ? "Unsubscribe" : "Subscribe"}
        aria-label="Subscribe tooltip"
      >
        <Button
          p={5}
          variant="ghost"
          onClick={handleSubscribe}
          fontWeight={"bold"}
          bg={isSubscribed ? "gray.700" : "brand.100"}
          borderRadius={"50px"}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
      </Tooltip>
      {showLoginPrompt && (
        <LoginPrompt
          isOpen={true}
          onClose={() => setShowLoginPrompt(false)}
          infoMessage="To Subscribe to a Podcast, you must be logged in. Please log in or create an account."
        />
      )}
    </>
  );
};

export default subscribeComponent;
