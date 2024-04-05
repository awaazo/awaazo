import React, { useState, useEffect } from 'react'
import { VStack, Text, Spinner, Wrap } from '@chakra-ui/react'
import HighlightTicket from '../highlights/HighlightTicket'
import { Highlight } from '../../types/Interfaces'
import HighlightHelper from '../../helpers/HighlightHelper'

const Snippets: React.FC = () => {
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchHighlights = async () => {
      setIsLoading(true)
      try {
        const highlightsData = await HighlightHelper.getRecommendedHighlights(20)
        if (highlightsData.length > 0) {
          setHighlights(highlightsData)
        } else {
          throw new Error('No highlights returned')
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching highlights')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHighlights()
  }, [])

  return (
    <Wrap spacing={4} align="stretch">
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : highlights.length > 0 ? (
        highlights.map((highlight) => <HighlightTicket key={highlight.id} highlight={highlight} onOpenFullScreen={() => {}} isFullScreenMode={false} />)
      ) : (
        <Text>No highlights available</Text>
      )}
    </Wrap>
  )
}

export default Snippets
