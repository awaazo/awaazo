import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Stack, Text, Flex, ButtonGroup, Img, Alert, AlertDescription } from "@chakra-ui/react";
import Logo from "../../public/logo_white.svg";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { ChangePasswordRequest } from "../../../utilities/Requests";
import { FaGoogle } from "react-icons/fa";
import { isEmail } from "validator";
import UserProfileHelper from "../../../helpers/UserProfileHelper";

const ChangePasswordForm: React.FC = () => {
const [changePasswordError, setChangePasswordError] = useState<string | null>("");
const [oldPassword, setOldPassword] = useState<string | null>("");
const [newPassword, setNewPassword] = useState<string | null>("");
const [confirmNewPassword, setConfirmPassword] = useState<string | null>("");
// export default function ChangePassWordForm() {
//     useEffect(() => {
//         console;
//         UserProfileHelper.profileGetRequest().then((response) => {
//             if (response.status == 200) {
//                 console.log(response.userProfile.bio);
//             }
//         });
//     });


const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);

    if(!oldPassword){
        setChangePasswordError("Enter your current password.");
        return;
    }

    if(!newPassword || newPassword.length < 8 || !/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
        setChangePasswordError("Your new Password must be at least 8 characters long and include both letters and numbers.");
        return;
    }

    if(newPassword !== confirmNewPassword){
        setChangePasswordError("Your new Passwords do not match.")
        return;
    }

    const changePasswordRequest: ChangePasswordRequest = {
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
    };

    try{
        const response = await UserProfileHelper.changePasswordRequest(changePasswordRequest);
        if(response.status === 200){
            window.location.href = "/";
        } else {
            setChangePasswordError(response.data);
        }
    } catch (error) {
        setChangePasswordError("An error occured while changing Passwords...")
    }

}

return(
    <>
    <form onSubmit={handleChangePassword}>
      <Stack spacing={6} align={"center"}>
        {changePasswordError && <Text color="red.500">{changePasswordError}</Text>}

        <FormControl>
          <FormLabel>Current Password</FormLabel>
          <Input
            type="password"
            id="currentPassword"
            placeholder="Enter current password"
            // value={}
            // onChange={handleCurrentPasswordChange}
            borderRadius="0.8em"
          />
        </FormControl>

        <FormControl>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            id="newPassword"
            placeholder="Enter new password"
            // value={newPassword}
            // onChange={handleNewPasswordChange}
            borderRadius="0.8em"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Confirm New Password</FormLabel>
          <Input
            type="password"
            id="confirmNewPassword"
            placeholder="Confirm new password"
            // value={confirmNewPassword}
            // onChange={handleConfirmNewPasswordChange}
            borderRadius="0.8em"
          />
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
    </>
);
};

export default ChangePasswordForm;