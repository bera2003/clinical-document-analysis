import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {

    async jwt({ token, user, account }) {

      // Runs ONLY when user signs in with Google
      if (account && user) {

        const res = await fetch("http://127.0.0.1:8000/auth/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
          }),
        });

        const data = await res.json();

        // ✅ SAVE REAL JWT FROM FASTAPI
        token.accessToken = data.access_token;

        // ✅ SAVE USER
        token.user = data.user;
      }

      return token;
    },

    async session({ session, token }) {

      // ✅ PUSH TOKEN INTO SESSION
      (session as any).accessToken = token.accessToken;

      // ✅ PUSH USER INTO SESSION
      session.user = token.user as any;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
