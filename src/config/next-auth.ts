import type {NextAuthConfig} from 'next-auth'

import {providers} from './providers'

type ProvidersType = Pick<NextAuthConfig, 'callbacks' | 'pages' | 'providers'>

export const nextAuthConfig: ProvidersType = {
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: async ({auth, request: {nextUrl}}) => {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
}
