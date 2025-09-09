// utils/features.ts

export const slugify = (title: string) => {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
};

export function extractKeyFromUrl(url: string): string {
  const key = url.split("/").pop();
  return key!;
}

export const unSlugify = (slug: string) => {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export enum ResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN'
}

export function extractNameFromEmail(email: string): string {
  const [localPart] = email.split('@');
  const name = localPart
    .replace(/[\._-]/g, ' ')  // Replace ".", "_", or "-" with spaces
    .replace(/\d+/g, '')  // Remove numbers
    .split(' ')  // Split the string by spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize each word
    .join(' ');  // Join the words back together with spaces

  return name;
}

export const PASSWORD_RESET_REQUEST_TEMPLATE = ({
  resetUrl, ip, country, city, os, browser, userAgent, device
}: {
  resetUrl: string
  ip: string
  country: string
  city: string
  os: string
  browser: string
  userAgent: string
  device: string
}) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset From Borcelle</title>
</head>

<body style="margin: 0; padding: 0; font-family: Inter, sans-serif; background-color: #f3f4f6; color: #111827;">
    <div
        style="max-width: 600px; margin: 40px auto; background-color: white; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.05); overflow: hidden;">

        <div style="background: #111827; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; color: #f9fafb;">Reset Your Password</h1>
        </div>
        <a title="go to borcelle | home" aria-label="go to home" href="https://ecom-store-anas.vercel.app">
            <img src="https://ecom-store-anas.vercel.app/logo.png" alt=" borcelle logo"
                style="width: 130px; margin: 10px 20px; height: 70px;" />
        </a>
        <div style="padding: 0px 32px 32px 32px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hey there 👋 from Borcelle,</p>

            <p style="font-size: 16px; margin-bottom: 16px;">
                We received a request to reset your password. If this wasn't you, you can ignore this email.
            </p>

            <div style="text-align: center; margin: 32px 0;">
                <a titlt='Click here to Reset Password link' href="${resetUrl}"
                    style="display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                    Reset Password
                </a>
            </div>

            <p style="font-size: 14px; color: #6b7280; margin-bottom: 30px;">
                This link will expire in 1 hour for security reasons.
            </p>

            <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; font-size: 14px; color: #374151;">
                <h3 style="margin-top: 0; font-size: 16px; font-weight: 600; color: #111827;">Request Details</h3>
                <ul style="list-style: none; padding-left: 0; margin: 16px 0;">
                    <li><strong>IP:</strong> ${ip}</li>
                    <li><strong>Location:</strong> ${city}, ${country}</li>
                    <li><strong>Device:</strong> ${device}</li>
                    <li><strong>OS:</strong> ${os}</li>
                    <li><strong>Browser:</strong> ${browser}</li>
                    <li><strong>User Agent:</strong> ${userAgent}</li>
                </ul>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                If you're having issues, feel free to contact our support team.
            </p>
            <a title="Contact us" href="https://ecom-store-anas.vercel.app/contact" style="margin: 0;">Contact Us.</a>
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
                If you did not make this request please ignore it.
            </p>
            <a title="Contact us" href="https://ecom-store-anas.vercel.app" style="margin: 0;">From Borcell's Team,</a>
            <br>
        </div>

        <div style="padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; background-color: #f3f4f6;">
            <p style="margin: 0;">This is an automated message. Please do not reply.</p>
        </div>
    </div>
</body>

</html>
`;
};



export const fallbackHomeData: HomePage = {
  seo: {
    title: '',
    desc: '',
    keywords: [''],
    url: '',
    width: 0,
    height: 0,
    alt: '',
  },
  hero: {
    heading: '',
    text: '',
    imgUrl: '/hero.avif',
    // imgUrl: 'https://assets-manager.abtasty.com/2df40c2acabd6f9cf3388199e17e4ce4/25ss_influencer-inverse_site_and_app_full-bleed-hero_large-desk_2000x694px_2-nocopy.jpg',
    shade: '',
    textColor: '#ffff',
    textPosition: 'center',
    link: '#collections',
    buttonText: 'Explore our collections',
    isVideo: false
  },
  collections: [
    {
      heading: '',
      text: '',
      imgUrl: '/summer.jpg',
      shade: '',
      textColor: '',
      link: '/collections/summer',
      buttonText: '',
      textPosition: 'center',
      textPositionV: 'center',
      collectionId: '682203b1b50a422585dca64d',
      isVideo: false,
    },
    {
      heading: '',
      text: '',
      imgUrl: 'https://e1s0bwzoxc.ufs.sh/f/EHhleKT2TuF34TtjXyzxhtOeNMLjQPXk9UF8zmWCg160n3cS',
      shade: '',
      textColor: '',
      link: '/collections/men',
      buttonText: '',
      textPosition: 'center',
      textPositionV: 'center',
      collectionId: '68bed35bfa5c5728ba60fce5',
      isVideo: false,
    },
    // {
    //   heading: 'Footwear Collection',
    //   text: 'Step into style with our curated range of shoes, sneakers, and sandals designed for comfort and fashion.',
    //   imgUrl: 'https://res.cloudinary.com/dvnef4cyd/image/upload/v1745932983/imaginify/yhxgvnyiomxd9u5zxmw6.jpg',
    //   shade: 'black',
    //   textColor: 'white',
    //   link: '/collections/footwear',
    //   buttonText: '',
    //   textPosition: 'center',
    //   textPositionV: 'center',
    //   collectionId: '6810d2c78ea9e382250af8be',
    //   isVideo: false,
    // },
  ],
}

export function estimateWeight(categoryOrTitle: string): number {
  const input = categoryOrTitle.toLowerCase();

  if (input.includes("t-shirt") || input.includes("shirt")) return 0.3;
  if (input.includes("hoodie") || input.includes("jacket")) return 0.6;
  if (input.includes("shoes") || input.includes("sneakers")) return 1.0;
  if (input.includes("pants") || input.includes("trousers")) return 0.5;
  if (input.includes("accessory") || input.includes("belt") || input.includes("cap")) return 0.2;

  return 0.5;
}

export function isHex24(str: string) {
  return /^[a-fA-F0-9]{24}$/.test(str);
}

export function isHex21(str: string) {
  return /^[a-fA-F0-9]{21}$/.test(str);
}

export function statusValidation(status: string): string {
  const input = status.toLowerCase();

  if (input.includes("pending") || input.includes("processing")) return "pending";
  if (input.includes("shipped")) return "shipped";
  if (input.includes("delivered")) return "delivered";
  if (input.includes("canceled")) return "canceled";

  return 'shipped';
}
type Dimensions = {
  length: number; // cm
  width: number;
  height: number;
};

export function estimateDimensions(categoryOrTitle: string): Dimensions {
  const input = categoryOrTitle.toLowerCase();

  if (input.includes("t-shirt") || input.includes("shirt")) {
    return { length: 30, width: 25, height: 2 };
  }

  if (input.includes("hoodie") || input.includes("jacket")) {
    return { length: 35, width: 30, height: 5 };
  }

  if (input.includes("shoes") || input.includes("sneakers")) {
    return { length: 35, width: 25, height: 12 };
  }

  if (input.includes("pants") || input.includes("trousers")) {
    return { length: 35, width: 28, height: 4 };
  }

  if (input.includes("accessory") || input.includes("cap") || input.includes("belt")) {
    return { length: 20, width: 15, height: 3 };
  }
  if (input.includes("3 piece") || input.includes("3pcs") || input.includes("suit")) {
    return { length: 35, width: 25, height: 6 }; // Example dimensions for clothing
  }
  return { length: 30, width: 20, height: 5 };
}
