import Api from "@/Api";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      try {
        const dbUser = await Api.getOrCreateUserByEmail(session.user.email);
        // Send properties to the client, like an access_token and user id from a provider.
        session.accessToken = token.accessToken;
        session.user.id = dbUser._id;

        return session;
      } catch (error) {
        return session;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
