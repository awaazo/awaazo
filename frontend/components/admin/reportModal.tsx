import React, { useEffect, useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, Button, Select, Text } from '@chakra-ui/react'
import AuthHelper from '../../helpers/AuthHelper'
import { UserMenuInfo } from '../../types/Interfaces'
import AuthPrompt from '../auth/AuthPrompt'
import AdminHelper from '../../helpers/AdminHelper'
import { ReportRequest } from '../../types/Requests'

const ReportModal = ({ isOpen, onClose, entityName, entityId }) => {
  const [selectedReason, setSelectedReason] = useState('')
  const [selectedDescription, setSelectedDescription] = useState('')
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined)

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        try {
          const response = await AuthHelper.authMeRequest()
          console.log('User fetched:', response)

          if (response.status === 200) {
            setUser(response.userMenuInfo)
          }
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      }
    }
    fetchUser()
  }, [])

  const reportReasons = {
    'Inappropriate Content': {
      description: 'Contains content that is inappropriate, offensive, or violates community guidelines. This may include explicit language, nudity, or other sensitive material.',
    },
    'Harassment or Bullying': {
      description: 'Involves harassing or bullying behavior towards individuals or groups. This includes targeted attacks, threats, or intimidation.',
    },
    'Hate Speech': {
      description: 'Contains hate speech or promotes discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or other factors.',
    },
    'Violence or Threats': {
      description: 'Contains violent or threatening content towards individuals or groups. This may include direct threats of harm or graphic depictions of violence.',
    },
    'Copyright Infringement': {
      description: 'Uses copyrighted material without proper permission or attribution. This includes unauthorized use of images, music, videos, or other creative works.',
    },
    'Spam or Scam': {
      description: 'Engages in spamming or scamming activities. This includes unsolicited messages, deceptive practices, or fraudulent schemes.',
    },
    Impersonation: {
      description: 'Impersonates another person or entity. This may involve creating fake accounts or pretending to be someone else for deceptive purposes.',
    },
    'Privacy Violation': {
      description: 'Shares private or sensitive information without consent. This includes posting personal data, confidential documents, or intimate photos without permission.',
    },
    'Misinformation or Fake News': {
      description: 'Spreads false or misleading information. This may include hoaxes, conspiracy theories, or misinformation designed to deceive or manipulate.',
    },
    'Graphic or Explicit Content': {
      description: 'Contains graphic or explicit content that may not be suitable for all audiences. This includes explicit images, videos, or descriptions of violence, sex, or other mature themes.',
    },
  }

  const handleReasonChange = (event) => {
    const reason = event.target.value
    setSelectedReason(reason)
    setSelectedDescription(reportReasons[reason].description)
  }

  const handleReport = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    const data: ReportRequest = { targetEntityName: entityName, targetId: entityId, reportedBy: user.id, reason: selectedReason }

    const response = await AdminHelper.userReportRequest(data)
    if (response.status === 200) {
      console.log('Report submitted successfully:', response)
    } else {
      console.error('Error submitting report:', response)
    }

    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Report</ModalHeader>
        <ModalBody>
          <Select placeholder="Select reason" value={selectedReason} onChange={handleReasonChange}>
            {Object.keys(reportReasons).map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </Select>
          {selectedReason && <Text mt={2}>{selectedDescription}</Text>}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleReport}>
            Report
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
      {showLoginPrompt && <AuthPrompt isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} infoMessage="Login to Report ." />}
    </Modal>
  )
}

export default ReportModal
