import Customer from "../models/Customer"
import { connectToDB } from "../mongoDB"
import { extractNameFromEmail } from "../utils/features"

export async function getUser({
  email,
  provider,
  ip,
  userAgent,
  country,
  city,
  browser,
  device,
  os,
  isSigningUpUserWithCredientials = false,
}: {
  email: string
  provider: 'google' | 'github' | 'credentials' | 'none'
  ip: string
  userAgent: string
  country: string
  city: string
  browser: string
  device: string
  os: string
  isSigningUpUserWithCredientials?: boolean
}) {
  try {
    await connectToDB();
    const user = await Customer.findOne({ email });

    if (!user) {
      return null;
    }

    const providerMatches =
      (provider === 'google' && user.googleId) ||
      (provider === 'credentials' && user.password);
    //|| (provider === 'github' && user.githubid);


    if (isSigningUpUserWithCredientials) {
      if (providerMatches) {
        return user as User;
      }
      throw new Error('A user with this email already exists with another sign-in method');
    }

    if (!providerMatches) {
      throw new Error('Email already exists with a different sign-in method');
    }
    user.signInHistory.unshift({
      country,
      city,
      ip,
      browser,
      os,
      device,
      userAgent: userAgent || '',
      signedInAt: new Date(),
    });

    user.signInHistory = user.signInHistory.slice(0, 3);
    if (user.country?.trim().toLowerCase() === 'unknown' || user.country?.trim().toLowerCase() === 'localhost') {
      user.country = country;
    };
    if (user.city?.trim().toLowerCase() === 'unknown' || user.city?.trim().toLowerCase() === 'localhost') {
      user.city = city;
    };

    await user.save();

    return user as User;
  } catch (error) {
    const err = error as Error
    throw new Error(err.message)
  }
}

export async function createUser({ email,
  ip,
  hashedPassword,
  userAgent,
  country,
  city,
  browser,
  device,
  os,
  isSigningUpUserWithCredientials = false
}: {
  email: string,
  hashedPassword: string,
  ip: string,
  userAgent: string,
  country: string,
  city: string,
  browser: string,
  device: string,
  os: string,
  isSigningUpUserWithCredientials?: boolean
}) {
  try {

    const existingUser = await getUser({ email, provider: 'credentials', browser, city, country, ip, userAgent, os, device });


    if (existingUser) {
      return null;
    } else {
      const name = extractNameFromEmail(email);
      const user = await Customer.create({
        name: name,
        email: email,
        country: country.toLowerCase(),
        city: city.toLowerCase(),
        password: hashedPassword,
        image: `https://ui-avatars.com/api/?name=${name}`,
        signInHistory: [{
          country,
          city,
          ip,
          browser,
          os,
          device,
          userAgent: userAgent || '',
          signedInAt: new Date(),
        }]
      })
      return user as User;
    }
  } catch (error) {
    console.log('creating User: ' + (error as Error).message);
    throw new Error('creating User: ' + (error as Error).message);
  }
}