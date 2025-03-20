import NextAuth from 'next-auth'

import { nextAuthConfig } from "./next-auth";

export const {handlers, auth, signIn, signOut} = NextAuth({
  ...nextAuthConfig,
  secret: process.env.AUTH_SECRET,
})