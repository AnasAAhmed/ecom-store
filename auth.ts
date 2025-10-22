import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { extractNameFromEmail } from './lib/utils/features';
import { connectToDB } from './lib/mongoDB';
import Customer from './lib/models/Customer';
import { getUser } from './lib/actions/user.actions';
import { headers, type UnsafeUnwrappedHeaders } from 'next/headers';
import fetch from 'node-fetch';
import { UAParser } from 'ua-parser-js';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    newUser: '/sign-up',
    signIn: '/login',
    error: '/error'
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com', required: true },
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        id: { label: 'Id', type: 'text', placeholder: '23232-3ddd23-2asda13-fgdgdd', required: true },
        image: { label: 'Image', type: 'text', placeholder: "https://ui-avatar.com/anas", required: true },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        const image = credentials.image as string || 'failed';
        const email = credentials.email as string || 'failed';
        const name = credentials.username as string || 'failed';
        const id = credentials.id as string || 'failed';

        return { id, image, name, email };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {

          const ip = (await (headers())).get('x-forwarded-for') || '36.255.42.109';
          const userAgent = (await (headers())).get('user-agent') || '';
          const parser = new UAParser(userAgent);
          const result = parser.getResult();
          let country = "oooo";
          let city = "pppp";
          
          if (ip && ip !== '::1' && ip !== '127.0.0.1') {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
            const geoData = await geoRes.json();
            country = geoData.country || 'Unknown';
            city = geoData.city || 'Unknown';
          } else {
            country = "Localhost";
            city = "Localhost";
            console.log("Skipping geo lookup for local IP:", ip);
          }

          const os = `${result.os.name} ${result.os.version}`;
          const device = result.device.type || "Desktop";
          const browser = `${result.browser.name} ${result.browser.version}`;

          const googleUser: User | null = await getUser({ email: user.email!, provider: 'google', browser, city, country, ip, userAgent, os, device });

          if (!googleUser) {
            await connectToDB();
            const newUser = await Customer.create({
              email: user.email!,
              name: extractNameFromEmail(user.email!),
              googleId: account.providerAccountId,
              image: user.image!,
              city,
              country,
              signInHistory: [{
                country: country,
                city: city,
                ip: ip,
                browser,
                os,
                device,
                userAgent: userAgent || '',
                signedInAt: new Date(),
              }]
            });

            (user as any).dbId = newUser.id;
            (user as any).username = newUser.name;
          } else {
            (user as any).dbId = googleUser.id;
            (user as any).username = googleUser.name;
          }
          return true;
        } catch (error) {
          return `/error?message=${encodeURIComponent((error as Error).message)}&provider=${account.provider}`

        }
      }
      if (account?.provider === 'credentials') return true;
      return false;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = (user as any).dbId || user.id; // fallback for credentials
        token.name = (user as any).username || user.name; // fallback for credentials
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
        session.user.name = token.name
      }
      return session;
    },
  },
});
