import React from 'react';
import { Box, Img, Text, FormControl, Textarea, Stack, useBreakpointValue, Button } from '@chakra-ui/react';
import LogoWhite from '../../../public/logos/logo_white.svg';

interface BioPageProps {
    username: string;
    bio: string;
    bioCharacterCount: number;
    handleBioChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    nextPage: () => void;
    prevPage: () => void;
}

const BioPage: React.FC<BioPageProps> = ({ username, bio, bioCharacterCount, handleBioChange, nextPage, prevPage }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center" mx="auto" alignContent={"center"} verticalAlign={"center"} height={"50vh"}>
            <Img src={LogoWhite.src} alt="logo" maxHeight="10em" maxWidth="3em" />
            <Text fontSize="1.5rem" textAlign="center" margin="1rem">
                @{username}
            </Text>
            <Text fontSize="1.5rem" textAlign="center" margin="1rem" fontWeight={"black"}>
                What's Your Story?
            </Text>

            <form onSubmit={nextPage}>
                <Stack spacing={6} align={'center'}>
                    <FormControl position="relative" width={isMobile ? "80vw" : "30vw"}>
                        <Textarea
                            id="bio"
                            placeholder="e.g. I love to listen to podcasts about technology and science. I'm a software engineer by day and a podcast enthusiast by night."
                            value={bio}
                            onChange={handleBioChange}
                            width="100%"
                            height="100px"
                            padding="12px"
                            fontSize="16px"
                            borderRadius="18px"
                            resize="vertical"
                        />
                        <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                            {bioCharacterCount}/250
                        </Text>
                    </FormControl>
                    <Button type="submit" colorScheme="teal"
                        size="lg" borderRadius="17px" width="100%"
                        fontSize={"1em"}
                        boxShadow="md">Next</Button>
                    <Button onClick={prevPage} variant={"minimal"}>Back</Button>
                </Stack>
            </form>
        </Box>
    );
};

export default BioPage;
