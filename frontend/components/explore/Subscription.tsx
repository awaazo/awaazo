import React, {useState, useEffect} from "react";
import SubscribeHelper from "../../helpers/SubscribeHelper";
import { Button, Icon, Tooltip } from "@chakra-ui/react";
import { FaCheck, FaPlus } from "react-icons/fa";
import { BaseResponse } from "../../utilities/Responses";

const subscribeComponent = ({
    PodcastId,
    initialIsSubscribed,
}) => {
    const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);

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
                    console.error("Exception when calling unsubscribePodcast:", error.message);
                });
        } else {
            // Call subscribePodcast because the podcast is currently not subscribed
            // Call subscribePodcast because the podcast is currently not subscribed
            SubscribeHelper.addSubscription(PodcastId)
            .then((response: BaseResponse) => {
                if (response.status === 200) {
                    // Update the UI to reflect the subscribe
                    setIsSubscribed(true);
                } else {
                    console.error("Error subscribing podcast. Server returned status:", response.status);
                    if (response.message) {
                        console.error("Error message:", response.message);
                    }
                }
            })
            .catch((error) => {
                console.error("Exception when calling subscribePodcast:", error.message);
            });
        }
    };

    return (
        <>
            <Tooltip
                label={isSubscribed ? "Unsubscribe" : "Subscribe"}
                aria-label="Subscribe tooltip"
            >
                <Button
                    p={2}
                    variant="ghost"
                    onClick={handleSubscribe}
                    colorScheme={isSubscribed ? "gray" : "red"}
                >
                    {isSubscribed ? "Unsubscribe" : "Subscribe"}
                </Button>

            </Tooltip>
        </>
    );
};

export default subscribeComponent;