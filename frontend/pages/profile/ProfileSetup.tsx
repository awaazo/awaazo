import React, { useState, FormEvent, useEffect, useCallback } from 'react';
import { useBreakpointValue, Progress } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import AuthHelper from '../../helpers/AuthHelper';
import { UserProfileSetupRequest } from '../../types/Requests';
import UserProfileHelper from '../../helpers/UserProfileHelper';
import { UserMenuInfo } from '../../types/Interfaces';
import withAuth from '../../utilities/authHOC';
import DisplayNamePage from './Setup/DisplayNamePage';
import BioPage from './Setup/BioPage';
import InterestsPage from './Setup/InterestsPage';
import AvatarPage from './Setup/AvatarPage';


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
      window.location.href = mainPage;
    } else {
      setSetupError('Avatar, Display Name and Bio Required.');
    }
  };

  const handleInterestClick = (selectedGenres: string[]) => {
    // Update the 'tags' state with the new set of selected genres
    setSelectedInterests(selectedGenres);
  };

  // Ensures display name is not longer than 25 characters
  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); 
    const newDisplayName = e.target.value.slice(0, 25);
    setDisplayName(newDisplayName);
    setDisplayNameCharacterCount(newDisplayName.length);
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); 
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

  const progressBarValue = (currentPage + 1) * (100 / 4); 
  return (
    <>
      {/* Progress bar */}
      <Progress value={progressBarValue} size="sm" style={
        {
          position: 'fixed',
          top: 0,
          left: 0,
          width: "100%"
        }
      }
        transition={'all 0.5s ease-in-out'}
      />

      {/* Page content */}
      {user !== undefined && (
        <>
          {currentPage === 0 && <DisplayNamePage username={user.username} displayName={displayName} displayNameCharacterCount={displayNameCharacterCount} handleDisplayNameChange={handleDisplayNameChange} nextPage={nextPage} />}
          {currentPage === 1 && <AvatarPage handleImageAdded={handleImageAdded} handleSetup={handleSetup} nextPage={nextPage} prevPage={prevPage} />}
          {currentPage === 2 && <BioPage username={user.username} bio={bio} bioCharacterCount={bioCharacterCount} handleBioChange={handleBioChange} nextPage={nextPage} prevPage={prevPage} />}
          {currentPage === 3 && <InterestsPage handleInterestClick={handleInterestClick} handleSetup={handleSetup} prevPage={prevPage} nextPage={nextPage} />}
        </>
      )}
    </>
  );
};

export default withAuth(ProfileSetup);
