import NextAuth from "next-auth";
import Cognito from "next-auth/providers/cognito";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Cognito({
      clientId: process.env.AWS_COGNITO_APP_CLIENT_ID,
      clientSecret: process.env.AWS_COGNITO_APP_CLIENT_SECRET,
      issuer: process.env.AWS_COGNITO_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial login
      if (profile?.sub) {
        token.userSub = profile.sub;
      }
      if (account?.id_token) {
        token.idToken = account.id_token;
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token.userSub) {
        session.user.sub = token.userSub as string;
      }

      if (token.idToken) {
        session.idToken = token.idToken as string;
      }

      return session;
    },
  },
});
