import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import AuthHelper from "../../../helpers/AuthHelper";
import { Profile } from "next-auth";
import { GoogleSSORequest } from "../../../types/Requests";

export default NextAuth({
    providers:[
        GoogleProvider({
            clientId:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        console.log("Profile Object:", profile);
        console.log("Account Object:", account); 

        if (account.provider === 'google') {
          const uniqueID = profile.sub;
          await saveToDatabase(profile,account.id_token);
          return true;
        }
        
        return false;
      },
        async redirect({ url, baseUrl }) {
          console.log("callback redirect url "+baseUrl)
          return baseUrl; 
        },
        async session({ session, token, user }) {
          return {
            ...session,
            token: token,
            id: token.sub || user.id,
          };
        },
        async jwt({ token, account, profile }) {
          // Persist the OAuth access_token and or the user id to the token right after signin
          if (account) {
            token.accessToken = account.access_token
            token.id_token = account.id_token
          }
          return token
        },
      },
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
});

async function saveToDatabase(profile: Profile, token:string) {
    console.log("Profile Object:", profile)
    const googleSSORequest: GoogleSSORequest = {
       email: profile.email,
       sub: profile.sub,
       token: token,
       avatar: (profile as any).picture,
       name: profile.name
     } 
    const response = await AuthHelper.loginGoogleSSO(googleSSORequest);
    console.log("Response Object:", response);
  }
