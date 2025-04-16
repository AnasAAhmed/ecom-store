import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { extractNameFromEmail } from './lib/utils/features';
import { connectToDB } from './lib/mongoDB';
import Customer from './lib/models/Customer';
import { getUser } from './lib/actions/actions';
import { headers } from 'next/headers';
import fetch from 'node-fetch';
import { UAParser } from 'ua-parser-js';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    newUser: 'sign-up',
    signIn: 'login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
        userAgent: { label: 'userAgent', type: 'text', placeholder: 'Pakistan' },
        ip: { label: 'ip', type: 'text', placeholder: '36.255.42.109' },
        country: { label: 'country', type: 'text', placeholder: 'Pakistan' },
        city: { label: 'city', type: 'text', placeholder: 'KArachi' },
        device: { label: 'device', type: 'text', placeholder: 'Desktop' },
        browser: { label: 'browser', type: 'text', placeholder: 'chrome, firefox' },
        os: { label: 'os', type: 'text', placeholder: "mac os, windows, linux" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('No credentials provided');
        }
        const ip = credentials.ip as string || 'unknown';
        const userAgent = credentials.userAgent as string || 'unknown';
        const country = credentials.country as string || 'unknown';
        const city = credentials.city as string || 'unknown';
        const device = credentials.device as string || "desktop";
        const browser = credentials.browser as string || 'unknown';
        const email = credentials.email as string;
        const password = credentials.password as string;
        const os = credentials.os as string || 'unknown';

        const user: User | null = await getUser(email, ip, userAgent, country, city, browser, device, os, false);

        if (!user) {
          return null
        }
        if (!user.password) {
          return null
        }
        const isMatched = await compare(password, user.password);
        if (!isMatched) {
          return null
        }

        return { id: user.id, image: user.image, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {

          const ip = '36.255.42.109';
          // const ip = headers().get('x-real-ip') || '36.255.42.109';
          const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
          const geoData = await geoRes.json();
          const userAgent = headers().get('x-user-agent') || '';
          const parser = new UAParser(userAgent);
          const result = parser.getResult();

          const country = geoData.country|| 'Unknown';
          const city = geoData.city || 'Unknown';
          const os = `${result.os.name} ${result.os.version}`;
          const device = result.device.type || "Desktop";
          const browser = `${result.browser.name} ${result.browser.version}`;

          const googleUser = await getUser(user.email!, ip, userAgent, country, city, browser, device, os, false);

          if (!googleUser) {
            await connectToDB();
            const newUser = await Customer.create({
              email: user.email!,
              name: extractNameFromEmail(user.email!),
              googleId: user.id,
              image: user.image!
            });

            (user as any).dbId = newUser.id;
            (user as any).username = newUser.name;

            newUser.country = country;
            newUser.city = city;
            newUser.signInHistory = [{
              country: country,
              city: city,
              ip: ip,
              browser,
              os,
              device,
              userAgent: userAgent || '',
              signedInAt: new Date(),
            }];
            await newUser.save();
          } else {
            (user as any).dbId = googleUser.id;
            (user as any).username = googleUser.name;
          }
          return true;
        } catch (error) {
          throw new Error('Error while creating or updating user');
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
