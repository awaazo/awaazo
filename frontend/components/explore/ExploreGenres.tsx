import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import techImage from '../../styles/images/genres/tech.png'
import educationImage from '../../styles/images/genres/Education.png'
import comedyImage from '../../styles/images/genres/comedy.png'
import NewsImage from '../../styles/images/genres/News.png'
import businessImage from '../../styles/images/genres/Business.png'
import sportsImage from '../../styles/images/genres/Sports.png'
import wellnessImage from '../../styles/images/genres/Wellness.png'
import otherImage from '../../styles/images/genres/other.png'
import GenreCard from '../cards/GenreCard'
import { useTranslation } from 'react-i18next'

const ExploreGenres = () => {
  const { t } = useTranslation();
  const [hoveredGenre, setHoveredGenre] = useState(null)

  // Define the genres array with name, image, and link properties
  const genres = [
    { name: t('genre.tech'), image: techImage, link: 'Technology', podcastCount: 43 },
    { name: t('genre.education'), image: educationImage, link: 'Education', podcastCount: 3132 },
    { name: t('genre.comedy'), image: comedyImage, link: 'Comedy', podcastCount: 3412 },
    { name: t('genre.news'), image: NewsImage, link: 'News', podcastCount: 3112 },
    { name: t('genre.business'), image: businessImage, link: 'Business', podcastCount: 3122 },
    { name: t('genre.sports'), image: sportsImage, link: 'Sports', podcastCount: 3122 },
    { name: t('genre.wellness'), image: wellnessImage, link: 'Wellness', podcastCount: 3122 },
    { name: t('genre.other'), image: otherImage, link: 'Other', podcastCount: 3123 },
  ]

  return (
    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap="5px" width={'100%'}>
      {genres.map((genre) => (
        <Box
          key={genre.name}
          width={{
            base: '50%',
            md: '31%',
            lg: '23%',
            xl: '16%',
          }}
        >
          <GenreCard genre={genre} onMouseEnter={setHoveredGenre} onMouseLeave={() => setHoveredGenre(null)} />
        </Box>
      ))}
    </Box>
  )
}

export default ExploreGenres
