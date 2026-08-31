import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '@/lib/prisma';

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "silk-route-ecommerce-jwt-secret-key-32-chars",
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
    }),
    CredentialsProvider({
      name: 'OTP',
      credentials: {
        email: { label: "Email or Phone", type: "text", placeholder: "you@example.com" },
        otp: { label: "OTP", type: "password", placeholder: "123456" }
      },
      async authorize(credentials) {
        if (credentials?.otp === "123456" && credentials.email) {
          // Find or create user
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email.split('@')[0],
                role: credentials.email === 'admin@silk.com' ? 'ADMIN' : 'USER'
              }
            });
          } else if (credentials.email === 'admin@silk.com' && user.role !== 'ADMIN') {
            user = await prisma.user.update({
              where: { email: credentials.email },
              data: { role: 'ADMIN' }
            });
          }
          
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
