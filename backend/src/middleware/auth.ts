import { ExpressAuth, type ExpressAuthConfig } from "@auth/express";

// Authentication configuration
export const authConfig: ExpressAuthConfig = {
  providers: [
    // Add authentication providers here
    // Example: Google, GitHub, Credentials, etc.
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Required for Vercel deployment
  callbacks: {
    async session({ session, token }) {
      // Customize session data
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

// Export the auth middleware
export const authHandler = ExpressAuth(authConfig);
