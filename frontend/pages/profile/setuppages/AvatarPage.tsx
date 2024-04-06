import React from 'react';
import { Box, Text, Stack, Button, Img } from '@chakra-ui/react';
import ImageAdder from '../../../components/assets/ImageAdder';
import LogoWhite from '../../../public/logos/logo_white.svg';

interface AvatarPageProps {
    handleImageAdded: (addedImageUrl: string) => void;
    handleSetup: (e: React.FormEvent<HTMLFormElement>) => void;
    prevPage: () => void;
    nextPage: () => void;
}

const AvatarPage: React.FC<AvatarPageProps> = ({ handleImageAdded, handleSetup, prevPage, nextPage }) => {
    return (
        <Box p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center" mx="auto" alignContent={"center"} verticalAlign={"center"} height={"50vh"}>
            <Img src={LogoWhite.src} alt="logo" maxHeight="10em" maxWidth="3em" />
            <Text fontSize="1.5rem" textAlign="center" margin="1rem">
                Choose Your Avatar
            </Text>

            <form onSubmit={nextPage}>
                <Stack spacing={6} align={'center'}>
                    <ImageAdder onImageAdded={handleImageAdded} />
                    <Button type="submit" colorScheme="teal"
                        size="lg" borderRadius="17px" width="100%"
                        fontSize={"1em"}
                        boxShadow="md">Next</Button>
                    <Button variant={"minimal"}
                        onClick={prevPage}>Back</Button>
                </Stack>
            </form>
        </Box>
    );
};

export default AvatarPage;
