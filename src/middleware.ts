import NextAuth from 'next-auth';
import { nextAuthConfig } from "@/config/next-auth";

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

export default NextAuth(nextAuthConfig).auth;