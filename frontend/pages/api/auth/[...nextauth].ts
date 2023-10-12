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
          if (account.provider === 'google') {
            return true; // Returning true will continue the sign-in process
          }
          return false; // Returning false will reject the sign-in
        },
        async redirect({ url, baseUrl }) {
          return baseUrl; // Always redirect to the homepage
        },
      },
    secret: "123456789",

});