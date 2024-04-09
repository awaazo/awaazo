import React from 'react';
import { Box, Img, Text, Stack, useBreakpointValue, Button } from '@chakra-ui/react';
import LogoWhite from '../../../public/logos/logo_white.svg';
import GenreSelector from '../../../components/assets/GenreSelector';

interface InterestsPageProps {
    handleInterestClick: (selectedGenres: string[]) => void;
    nextPage: () => void;
    prevPage: () => void;
    handleSetup: (e: React.FormEvent<HTMLFormElement>) => void;
}

const InterestsPage: React.FC<InterestsPageProps> = ({ handleInterestClick, nextPage, prevPage, handleSetup }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center" mx="auto" alignContent={"center"} verticalAlign={"center"} height={"50vh"}>
            <Img src={LogoWhite.src} alt="logo" maxHeight="10em" maxWidth="3em" />
            <Text fontSize="1.5rem" textAlign="center" margin="1rem" fontWeight={"black"} marginBottom={"2em"}>
                What Are Your Interests
            </Text>

            <form onSubmit={handleSetup}>
                <Stack spacing={6} align={'center'} >
                    <GenreSelector onGenresChange={handleInterestClick} />
                    <Button type="submit" colorScheme="teal"
                        size="lg" borderRadius="17px" width="100%" marginTop={"2em"}
                        fontSize={"1em"}
                        boxShadow="md">🎉 Finish Setup</Button>
                    <Button onClick={prevPage} variant={"minimal"}>Back</Button>
                </Stack>
            </form>
        </Box>
    );
};

export default InterestsPage;
