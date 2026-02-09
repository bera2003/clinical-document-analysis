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

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {

    /**
     ✅ CRITICAL FIX
     Controls ALL redirects (login, logout, OAuth)
     Prevents NextAuth from sending users to /login
    */
    async redirect({ url, baseUrl }) {

      // Allow relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow same-origin URLs
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Default → ALWAYS landing page
      return baseUrl;
    },

    /**
     ✅ Attach FastAPI JWT to NextAuth token
    */
    async jwt({ token, user, account }) {

      // Runs ONLY on Google sign-in
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

        // Save backend JWT
        token.accessToken = data.access_token;

        // Save backend user
        token.user = data.user;
      }

      return token;
    },

    /**
     ✅ Expose JWT + user to frontend session
    */
    async session({ session, token }) {

      (session as any).accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
});

export { handler as GET, handler as POST };
