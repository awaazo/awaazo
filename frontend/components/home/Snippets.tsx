import React, { useState, useEffect } from 'react'
import { VStack, Text, Spinner, Wrap } from '@chakra-ui/react'
import HighlightTicket from '../highlights/HighlightTicket'
import { Highlight } from '../../types/Interfaces'
import HighlightHelper from '../../helpers/HighlightHelper'
import { useTranslation } from 'react-i18next'

const Snippets: React.FC = () => {
  const { t } = useTranslation()
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
          throw new Error(t('home.noHighlightsAvailable'))
        }
      } catch (err) {
        setError(err.message || t('home.fetchError'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchHighlights()
  }, [t])

  return (
    <Wrap spacing={4} align="stretch">
      {isLoading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : highlights.length > 0 ? (
        highlights.map((highlight) => <HighlightTicket key={highlight.id} highlight={highlight} onOpenFullScreen={() => {}} isFullScreenMode={false} />)
      ) : (
        <Text>{t('home.noHighlightsAvailable')}</Text>
      )}
    </Wrap>
  )
}

export default Snippets
