import { NextResponse } from 'next/server';
import { MailtrapClient } from 'mailtrap';
import { z } from 'zod';
import Customer from '@/lib/models/Customer';
import { connectToDB } from '@/lib/mongoDB';
import { PASSWORD_RESET_REQUEST_TEMPLATE } from '@/lib/utils/features';

const TOKEN = process.env.MAILTRAP_TOKEN!;

const client = new MailtrapClient({
  token: TOKEN,
  testInboxId: 3126243,
  accountId: 2047102,
});

const sender = {
  email: "mailtrap@example.com",
  name: "next-auth",
};

const recipients = [
  {
    email: "anasahmedd244@gmail.com",
  }
];
export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  const parsedCredentials = z
    .object({
      email: z.string().email(),
    })
    .safeParse({
      email,
    });

  if (!parsedCredentials.success) {
    let messages = ''
    parsedCredentials.error.issues.map((i, _) => (
        messages+=`${_>0?' & ':''}`+i.message
    ))
    return NextResponse.json({ type: 'error', resultCode:messages });
  }

  const token = crypto.randomUUID();
  const tokenExpirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now, in seconds

  try {
    await connectToDB();

    const user = await Customer.findOneAndUpdate(
      { email: parsedCredentials.data.email, password: { $ne: null } },
      {
        reset_token: token,
        token_expires: tokenExpirationTime,
      },
      {
        new: true,
        fields: { _id: 1 }
      }
    );
    if (user) {
      const resetUrl = `${process.env.ECOM_STORE_URL}/reset-password?token=${token}&id=${user.id}`

      const res = await client.testing.send({
        from: sender,
        to: recipients,//for testing its only an owner email
        subject: "Password Reset Request",
        html: PASSWORD_RESET_REQUEST_TEMPLATE(resetUrl),
        category: "Reset Token",
      });
      if (res.success) {
        return NextResponse.json({
          type: 'succes',
          resultCode: 'Reset password email sent.'
        });
      } else {
        return NextResponse.json({
          type: 'error',
          resultCode: 'Error sending mail'
        });
      }
    } else {
      return NextResponse.json({
        type: 'error',
        resultCode: 'Invalid Email'
      });
    }
  } catch (error) {
    const typeErr = error as Error;
    return NextResponse.json({
      type: 'error',
      resultCode: typeErr.message
    });
  }
}
