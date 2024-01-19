import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import UserProfileHelper from "../../../helpers/UserProfileHelper";
import { ChangePasswordRequest } from "../../../utilities/Requests";

const ChangePasswordForm: React.FC = () => {
    const [changePasswordError, setChangePasswordError] = useState<string | null>("");
    const [oldPassword, setOldPassword] = useState<string | null>("");
    const [newPassword, setNewPassword] = useState<string | null>("");
    const [confirmNewPassword, setConfirmPassword] = useState<string | null>("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);

    if (!newPassword || newPassword.length < 8 || !/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
      setChangePasswordError("Your new Password must be at least 8 characters long and include both letters and numbers.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setChangePasswordError("Your new Passwords do not match.");
      return;
    }

    const changePasswordRequest: ChangePasswordRequest = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
    };

    try {
      const response = await UserProfileHelper.changePasswordRequest(changePasswordRequest);
      if (response.status === 200) {
        window.location.href = "/profile/MyProfile";
      } else {
        setChangePasswordError(response.data);
      }
    } catch (error) {
      setChangePasswordError("An error occurred while changing Passwords...");
    }
  };
  
  const handlePasswordChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    switch (field) {
      case "oldPassword":
        setOldPassword(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmNewPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }

    setChangePasswordError(null);
  };

  const handleTogglePasswordVisibility = (field: string) => () => {
    switch (field) {
      case "oldPassword":
        setShowOldPassword(!showOldPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmNewPassword":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  return (
    <Box p={6} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <form onSubmit={handleChangePassword}>
        <Stack spacing={6} align={"center"}>
          {changePasswordError && <Text color="red.500">{changePasswordError}</Text>}

          <FormControl >
            <FormLabel>Current Password</FormLabel>
            <InputGroup>
              <Input
                type={showOldPassword ? "text" : "password"}
                id="currentPassword"
                placeholder="Enter current password"
                onChange={handlePasswordChange("oldPassword")}
                borderRadius="0.8em"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleTogglePasswordVisibility("oldPassword")}>
                  {showOldPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder="Enter new password"
                onChange={handlePasswordChange("newPassword")}
                borderRadius="0.8em"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleTogglePasswordVisibility("newPassword")}>
                  {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>Confirm New Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmNewPassword"
                placeholder="Confirm new password"
                onChange={handlePasswordChange("confirmNewPassword")}
                borderRadius="0.8em"
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleTogglePasswordVisibility("confirmNewPassword")}>
                  {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            fontSize="md"
            borderRadius="full"
            minWidth="200px"
            color="white"
            marginTop="15px"
            marginBottom="10px"
            padding="20px"
            outline="1px solid rgba(255, 255, 255, 0.6)"
            style={{
              background: "linear-gradient(45deg, #007BFF, #3F60D9, #5E43BA, #7C26A5, #9A0A90)",
              backgroundSize: "300% 300%",
              animation: "Gradient 10s infinite linear",
            }}
          >
            Change Password
            <style jsx>{`
              @keyframes Gradient {
                0% {
                  background-position: 100% 0%;
                }
                50% {
                  background-position: 0% 100%;
                }
                100% {
                  background-position: 100% 0%;
                }
              }
            `}</style>
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ChangePasswordForm;
