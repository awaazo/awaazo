import React, { useState, useEffect } from 'react'
import { Flex, Box, Image, Text, Avatar, Button, Icon, VStack } from '@chakra-ui/react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Reports from '../../components/admin/Reports'
import { AwaazoLogo } from '../../public/icons'
import Link from 'next/link'
import PodcastHelper from '../../helpers/PodcastHelper'
import UserProfileHelper from '../../helpers/UserProfileHelper'
import PodcastCard from '../../components/cards/PodcastCard'
import AdminHelper from '../../helpers/AdminHelper'

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
const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState(null)
  const [currentEntity, setCurrentEntity] = useState(null)

  useEffect(() => {
    const fetchEntityDetails = async () => {
      if (selectedReport) {
        let entityData = null
        if (selectedReport.targetEntityName === 'Podcast') {
          const res = await PodcastHelper.getPodcastById(selectedReport.targetId)
          entityData = res.podcast
        } else if (selectedReport.targetEntityName === 'Episode') {
          const res = await PodcastHelper.getEpisodeById(selectedReport.targetId)
          entityData = res.episode
        } else if (selectedReport.targetEntityName === 'User') {
          const res = await UserProfileHelper.profileGetByIdRequest(selectedReport.targetId)
          entityData = res.userProfileByID
        }
        setCurrentEntity(entityData)
        console.log('data :', entityData)
      }
    }

    fetchEntityDetails()
  }, [selectedReport])

  const handleReportSelect = (report) => {
    setSelectedReport(report)
  }

  const handleAcceptReport = async () => {
    try {
      const res = await AdminHelper.adminResolveReportRequest(selectedReport.id)
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const handleRejectReport = async () => {
    try {
      const res = await AdminHelper.adminRejectReportRequest(selectedReport.id)
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const PodcastComponent = ({ entityData }) => {
    return (
      <Box mb={4} display="flex" alignItems="left" width={'100%'}>
        <VStack width={'100%'}>
          <Flex width={'100%'}>
            <Box mr={4} justifyContent="left">
              <PodcastCard podcast={entityData} />
            </Box>
            <Box>
              <Text fontWeight="bold" mt={'10px'} mb={'5px'} fontSize={'24px'}>
                {entityData.name}
              </Text>
              <Text fontSize={'16px'} color={'az.greyish'}>
                {entityData.description}
              </Text>
              <Link href={`/Explore/${entityData.id}`} passHref>
                <Button as="a" bg="az.red" borderRadius="15px" mt="10px" mb="10px" fontSize="15px" height="30px" width="150px">
                  Visit Podcast
                </Button>
              </Link>
            </Box>

            <Box ml="auto" mr={4} mt={'10px'}>
              <Icon as={AwaazoLogo} color="white" boxSize={'24px'} />
            </Box>
          </Flex>
        </VStack>
      </Box>
    )
  }

  // EpisodeComponent.jsx
  const EpisodeComponent = ({ entityData }) => {
    return (
      <Box mb={4} display="flex" alignItems="left" width={'100%'}>
        <VStack width={'100%'}>
          <Flex width={'100%'}>
            <Box mr={4} justifyContent="left">
              <Image src={entityData.thumbnailUrl} boxSize={'175px'} borderRadius={'30px'} />
            </Box>
            <Box>
              <Text fontWeight="bold" mt={'10px'} mb={'5px'} fontSize={'24px'}>
                {entityData.episodeName}
              </Text>
              <Text fontSize={'16px'} color={'az.greyish'}>
                {entityData.description}
              </Text>
              <Link href={`/Explore/${entityData.podcastId}`} passHref>
                <Button as="a" bg="az.red" borderRadius="15px" mt="10px" mb="10px" fontSize="15px" height="30px" width="180px">
                  Visit Episode's Podcast
                </Button>
              </Link>
            </Box>

            <Box ml="auto" mr={4} mt={'10px'}>
              <Icon as={AwaazoLogo} color="white" boxSize={'24px'} />
            </Box>
          </Flex>
        </VStack>
      </Box>
    )
  }

  // UserComponent.jsx
  const UserComponent = ({ entityData }) => {
    return (
      <Box mb={4} display="flex" alignItems="left" width={'100%'}>
        <VStack width={'100%'}>
          <Flex width={'100%'}>
            <Box mr={4} justifyContent="left">
              <Avatar name={entityData.name} src={entityData.avatarUrl} boxSize={'175px'} />
            </Box>
            <Box>
              <Text fontWeight="bold" mt={'10px'} mb={'5px'} fontSize={'24px'}>
                {entityData.username}
              </Text>
              <Text>{entityData.bio}</Text>
              <Link href={`/profile/${entityData.id}`} passHref>
                <Button as="a" bg="az.red" borderRadius="15px" mt="10px" mb="10px" fontSize="15px" height="30px" width="150px">
                  Visit Profile
                </Button>
              </Link>
            </Box>

            <Box ml="auto" mr={4} mt={'10px'}>
              <Icon as={AwaazoLogo} color="white" boxSize={'24px'} />
            </Box>
          </Flex>
        </VStack>
      </Box>
    )
  }

  return (
    <Flex height={`calc((100vh - 100px))`}>
      <AdminSidebar />
      <Box flex="1" p="4" ml={'15px'}>
        <Text fontSize={'32px'} fontWeight={'bold'} mb={'15px'}>
          Reports
        </Text>
        <Flex height={'85vh'}>
          <Box flexBasis="55%" mr="15px">
            <Reports onSelectReport={handleReportSelect} selectedReport={selectedReport} inDashboard={false} />{' '}
          </Box>
          <Box flexBasis="50%" ml="15px">
            {selectedReport && (
              <Box mb={4} display="flex" alignItems="left" width={'100%'}>
                <VStack width={'100%'}>
                  {selectedReport && currentEntity && selectedReport.targetEntityName === 'Podcast' && <PodcastComponent entityData={currentEntity} />}
                  {selectedReport && currentEntity && selectedReport.targetEntityName === 'Episode' && <EpisodeComponent entityData={currentEntity} />}
                  {selectedReport && currentEntity && selectedReport.targetEntityName === 'User' && <UserComponent entityData={currentEntity} />}
                  <Flex mt={4} alignItems="center" justifyContent="space-between" width={'100%'} bg="rgba(129, 137, 144, 0.1)" borderRadius="20px" p="15px" flexDirection="column">
                    {' '}
                    {/* Change flex-direction to column */}
                    <Box width="100%">
                      <Text fontWeight="bold" fontSize="20px" color="az.red" mb={'30px'}>
                        {selectedReport.reason}
                      </Text>
                      <Text mb={'30px'}>
                        <b>Reporter:</b> {selectedReport.reporterName}
                      </Text>
                      <Text>{reportReasons[selectedReport.reason]?.description}</Text>
                    </Box>
                    <Flex width="100%" justifyContent="space-between" mt="40px">
                      {' '}
                      <Box>
                        <Button bg={'az.darkGrey'} color={'white'} borderRadius={'13px'} onClick={handleRejectReport}>
                          Reject Report
                        </Button>
                      </Box>
                      <Box>
                        <Button bg={'az.darkGrey'} color={'az.red'} borderRadius={'13px'} onClick={handleAcceptReport}>
                          Delete {selectedReport.targetEntityName}
                        </Button>
                      </Box>
                    </Flex>
                  </Flex>
                </VStack>
              </Box>
            )}
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

export default ReportsPage
