import React from 'react';
import { Box, Img, Text, FormControl, Button, Input, Stack, useBreakpointValue } from '@chakra-ui/react';
import LogoWhite from '../../../public/logos/logo_white.svg';

interface DisplayNamePageProps {
    username: string;
    displayName: string;
    displayNameCharacterCount: number;
    handleDisplayNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    nextPage: () => void;
}

const DisplayNamePage: React.FC<DisplayNamePageProps> = ({ username, displayName, displayNameCharacterCount, handleDisplayNameChange, nextPage }) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <Box p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center" mx="auto" alignContent={"center"} verticalAlign={"center"} height={"50vh"}>
            <Img src={LogoWhite.src} alt="logo" maxHeight="10em" maxWidth="3em" />
            <Text fontSize="1.5rem" textAlign="center" margin="1rem">
                Hey, @{username}!
            </Text>
            <Text fontSize="1.5rem" textAlign="center" margin="1rem" fontWeight={"black"}>
                What Should Others Call You?
            </Text>

            <form onSubmit={nextPage}>
                <Stack spacing={6} align={'center'}>
                    <FormControl position="relative" width={isMobile ? "80vw" : "30vw"}>
                        <Input id="displayName" placeholder="Enter Your Display Name" value={displayName} onChange={handleDisplayNameChange} alignSelf="center" width="100%" />
                        <Text position="absolute" right="8px" bottom="8px" fontSize="sm" color="gray.500">
                            {displayNameCharacterCount}/25
                        </Text>
                    </FormControl>
                    <Button type="submit" colorScheme="teal"
                        size="lg" borderRadius="17px" width="100%"
                        fontSize={"1em"}
                        boxShadow="md">Next</Button>
                </Stack>
            </form>
        </Box>
    );
};

export default DisplayNamePage;
