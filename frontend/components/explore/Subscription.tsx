import React, { useState, useEffect } from 'react'
import SubscribeHelper from '../../helpers/SubscribeHelper'
import { Button, Tooltip } from '@chakra-ui/react'
import { BaseResponse } from '../../types/Responses'
import AuthPrompt from '../auth/AuthPrompt'

const subscribeComponent = ({ PodcastId, initialIsSubscribed, podcasterId, currentUserID }) => {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  useEffect(() => {
    SubscribeHelper.getIsSubscribed(PodcastId)
      .then((isSubscribed) => {
        setIsSubscribed(isSubscribed)
      })
      .catch((error) => {
        console.error('Error checking subscription status:', error.message)
      })
  }, [PodcastId])

  // Function to handle the subscribe/unsubscribe action
  const handleSubscribe = () => {
    // Toggle the subscribe status based on whether the podcast is currently subscribed
    if (isSubscribed) {
      // Call unsubscribePodcast because the podcast is currently subscribed
      SubscribeHelper.addUnsubscription(PodcastId)
        .then((response) => {
          if (response.status === 200) {
            // Update the UI to reflect the unsubscribe
            setIsSubscribed(false)
          } else {
            console.error('Error unsubscribing podcast:', response.message)
          }
        })
        .catch((error) => {
          console.error('Exception when calling unsubscribePodcast:', error.message)
        })
    } else {
      // Call subscribePodcast because the podcast is currently not subscribed
      SubscribeHelper.addSubscription(PodcastId)
        .then((response: BaseResponse) => {
          if (response.status === 200) {
            // Update the UI to reflect the subscribe
            setIsSubscribed(true)
          } else if (response.status === 401) {
            setShowLoginPrompt(true)
          } else {
            console.error('Error subscribing podcast. Server returned status:', response.status)
            if (response.message) {
              console.error('Error message:', response.message)
            }
          }
        })
        .catch((error) => {
          console.error('Exception when calling subscribePodcast:', error.message)
        })
    }
  }
  if (podcasterId === currentUserID) {
    return null
  }
  return (
    <>
      <Button fontSize={'sm'} onClick={handleSubscribe} fontWeight={'bold'} bg={isSubscribed ? 'az.green' : 'az.red'} variant={'mini'}>
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </Button>

      {showLoginPrompt && <AuthPrompt isOpen={true} onClose={() => setShowLoginPrompt(false)} infoMessage="Login to Subscribe to a Podcast." />}
    </>
  )
}

export default subscribeComponent
