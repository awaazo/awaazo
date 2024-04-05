import React, { useState, FormEvent, useEffect, useCallback } from 'react';
import { Box, Img, Textarea, Button, FormControl, FormLabel, Input, Stack, Text, Wrap, WrapItem, useBreakpointValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import AuthHelper from '../../helpers/AuthHelper';
import LogoWhite from '../../public/logos/logo_white.svg';
import { UserProfileSetupRequest } from '../../types/Requests';
import UserProfileHelper from '../../helpers/UserProfileHelper';
import { UserMenuInfo } from '../../types/Interfaces';
import ImageAdder from '../../components/assets/ImageAdder';
import GenreSelector from '../../components/assets/GenreSelector';
import withAuth from '../../utilities/authHOC';
import DisplayNamePage from './setuppages/DisplayNamePage';
import BioPage from './setuppages/BioPage';
import InterestsPage from './setuppages/InterestsPage';
import AvatarPage from './setuppages/AvatarPage';
import next from 'next';

const ProfileSetup: React.FC = () => {
  const mainPage = '/';
  const loginPage = '/auth/Login';

  const [user, setUser] = useState<UserMenuInfo | undefined>(undefined);
  const [displayName, setDisplayName] = useState('');
  const [displayNameCharacterCount, setDisplayNameCharacterCount] = useState<number>(0);
  const [bio, setBio] = useState('');
  const [bioCharacterCount, setBioCharacterCount] = useState<number>(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [setupError, setSetupError] = useState('');
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  useEffect(() => {
    // Check to make sure the user has logged in
    AuthHelper.authMeRequest().then((res) => {
      if (res.status == 200) {
        setUser(res.userMenuInfo);
      } else {
        window.location.href = loginPage;
      }
    });
  }, [router]);

  const handleImageAdded = useCallback(async (addedImageUrl: string) => {
    try {
      const response = await fetch(addedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'avatar.jpg', { type: blob.type });
      setAvatarFile(file);
    } catch (error) {
      console.error('Error converting image URL to File:', error);
    }
  }, []);

  const handleSetup = async (e: FormEvent) => {
    e.preventDefault();

    // Create request object
    const request: UserProfileSetupRequest = {
      avatar: avatarFile,
      bio: bio,
      interests: selectedInterests,
      displayName: displayName,
    };

    // Send the request
    const response = await UserProfileHelper.profileSetupRequest(request);
    console.log(response);

    if (response.status === 200) {
      // Success, go to main page
      window.location.href = mainPage;
    } else {
      // Handle error here
      setSetupError('Avatar, Display Name and Bio Required.');
    }
  };

  const handleInterestClick = (selectedGenres: string[]) => {
    // Update the 'tags' state with the new set of selected genres
    setSelectedInterests(selectedGenres);
  };

  // Ensures display name is not longer than 25 characters
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Add this line
    const newDisplayName = e.target.value.slice(0, 25);
    setDisplayName(newDisplayName);
    setDisplayNameCharacterCount(newDisplayName.length);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); // Add this line
    const newBio = e.target.value.slice(0, 250);
    setBio(newBio);
    setBioCharacterCount(newBio.length);
  };


  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };





  if (user !== undefined) {
    switch (currentPage) {
      case 0:
        return <DisplayNamePage username={user.username} displayName={displayName} displayNameCharacterCount={displayNameCharacterCount} handleDisplayNameChange={handleDisplayNameChange} nextPage={nextPage} />;
      case 1:
        return <AvatarPage handleImageAdded={handleImageAdded} handleSetup={handleSetup} nextPage={nextPage} prevPage={prevPage} />;
      case 2:
        return <BioPage username={user.username} bio={bio} bioCharacterCount={bioCharacterCount} handleBioChange={handleBioChange} nextPage={nextPage} prevPage={prevPage} />;
      case 3:
        return <InterestsPage handleInterestClick={handleInterestClick} handleSetup={handleSetup} prevPage={prevPage} nextPage={nextPage} />;
      default:
        return null;
    }
  }

};

export default withAuth(ProfileSetup);
