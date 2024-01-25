import React, { useState } from 'react';
import { FormControl, FormLabel, Wrap, WrapItem, Button } from '@chakra-ui/react';

interface GenreSelectorProps {
  onGenresChange: (genres: string[]) => void;
}

const PodcastGenres = ["Technology", "Comedy", "Science", "History", "News", "Crime", "Business", "Health", "Education", "Travel", "Music", "Arts", "Sports", "Politics", "Fiction", "Food"];

const GenreSelector: React.FC<GenreSelectorProps> = ({ onGenresChange }) => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreColors, setGenreColors] = useState<{ [key: string]: string }>({});

  const handleInterestClick = (genre: string) => {
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(genre)) {
        const newGenres = prevSelectedGenres.filter((g) => g !== genre);
        onGenresChange(newGenres);
        return newGenres;
      } else {
        const newGenres = [...prevSelectedGenres, genre];
        onGenresChange(newGenres);
        return newGenres;
      }
    });

    if (!genreColors[genre]) {
      setGenreColors({ ...genreColors, [genre]: getRandomDarkColor() });
    }
  };

  function getRandomDarkColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 8)];
    }
    return color;
  }

  function getRandomGradient() {
    const color1 = getRandomDarkColor();
    const color2 = getRandomDarkColor();
    return `linear-gradient(45deg, ${color1}, ${color2})`;
  }

  return (
    <FormControl>
      <Wrap spacing={4} justify="center" maxWidth={"600px"}>
        {PodcastGenres.map((genre) => (
          <WrapItem key={genre}>
            <Button
              size="sm"
              variant={selectedGenres.includes(genre) ? "solid" : "outline"}
              colorScheme="white"
              backgroundColor={selectedGenres.includes(genre) ? genreColors[genre] || getRandomGradient() : "transparent"}
              color="white"
              borderColor="white"
              borderRadius="full"
              _hover={{
                backgroundColor: selectedGenres.includes(genre) ? genreColors[genre] || getRandomGradient() : "gray",
              }}
              onClick={() => handleInterestClick(genre)}
            >
              {genre}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    </FormControl>
  );
};

export default GenreSelector;
