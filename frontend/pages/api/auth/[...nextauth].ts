import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import AuthHelper from "../../../helpers/AuthHelper";
import { Profile } from "next-auth";

export default NextAuth({
    providers:[
        GoogleProvider({
            clientId:'512302750725-8ct0ekj20u9gkq8gsmg4d807co2voe71.apps.googleusercontent.com',
            clientSecret:'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',
        }),
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        //console.log("Profile Object:", profile); // Add this line
        //console.log("Account Object:", account); // Add this line

        if (account.provider === 'google') {
          const uniqueID = profile.sub;
          await saveToDatabase(profile);
          return true;
        }
        
        return false;
      },
        async redirect({ url, baseUrl }) {
          return baseUrl; // Always redirect to the homepage
        },
        async session({ session, token, user }) {
          //console.log("Token Object:", token); // Add this line
          return {
            ...session,
            id: token.sub || user.id,
          };
        },
      },
    secret: "123456789",
});

async function saveToDatabase(profile: Profile) {
    // Connect to a database, insert/update a user record, etc.
    console.log("Profile Object:", profile)
    await AuthHelper.loginGoogleSSO(profile.email,profile.name,profile.sub,(profile as any).picture);
  }
