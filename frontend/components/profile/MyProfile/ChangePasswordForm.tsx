import React, { useState } from "react";
import { Box, Button, FormControl, Heading, Input, InputGroup, Stack, Text } from "@chakra-ui/react";
import UserProfileHelper from "../../../helpers/UserProfileHelper";
import { ChangePasswordRequest } from "../../../types/Requests";

const ChangePasswordForm: React.FC = () => {
  const [changePasswordError, setChangePasswordError] = useState<string | null>("");
  const [oldPassword, setOldPassword] = useState<string | null>("");
  const [newPassword, setNewPassword] = useState<string | null>("");
  const [confirmNewPassword, setConfirmPassword] = useState<string | null>("");
  const [showOldPassword] = useState(false);
  const [showNewPassword] = useState(false);
  const [showConfirmPassword] = useState(false);

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

  return (
    <Box p={3} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Heading fontSize="2xl" marginBottom="1.5em">
        Change Password
      </Heading>
      <form onSubmit={handleChangePassword}>
        <Stack spacing={6} align={"center"}>
          {changePasswordError && <Text color="red.500">{changePasswordError}</Text>}

          <FormControl>
            <InputGroup flexDirection="column">
              <Input type={showOldPassword ? "text" : "password"} id="currentPassword" placeholder="Enter current password" onChange={handlePasswordChange("oldPassword")} borderRadius="1em" marginBottom={4} />
              <Input type={showNewPassword ? "text" : "password"} id="newPassword" placeholder="Enter new password" onChange={handlePasswordChange("newPassword")} borderRadius="1em" marginBottom={4} />
              <Input type={showConfirmPassword ? "text" : "password"} id="confirmNewPassword" placeholder="Confirm new password" onChange={handlePasswordChange("confirmNewPassword")} borderRadius="1em" marginBottom={4} />
            </InputGroup>
          </FormControl>

          <Button type="submit" variant="gradient">
            Change Password
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ChangePasswordForm;
