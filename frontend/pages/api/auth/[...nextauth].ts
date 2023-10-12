import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers:[
        GoogleProvider({
            clientId:'512302750725-8ct0ekj20u9gkq8gsmg4d807co2voe71.apps.googleusercontent.com',
            clientSecret:'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',
        }),
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        console.log("Profile Object:", profile); // Add this line
        if (account.provider === 'google') {
          const uniqueID = profile.sub;
          await saveToDatabase(email, uniqueID);
          return true;
        }
        return false;
      },
        async redirect({ url, baseUrl }) {
          return baseUrl; // Always redirect to the homepage
        },
        async session({ session, token, user }) {
          console.log("Token Object:", token); // Add this line
          return {
            ...session,
            id: token.sub || user.id,
          };
        },
      },
    secret: "123456789",
});

async function saveToDatabase(email, uniqueID) {
    // Connect to a database, insert/update a user record, etc.
    console.log(email, uniqueID);
  }
