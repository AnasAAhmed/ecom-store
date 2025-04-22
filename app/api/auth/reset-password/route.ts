import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    const body = await req.json();
    const { token, userId, password, ConfirmPassword } = body;
    try {

        const parsedCredentials = z
            .object({
                token: z.string().uuid(),
                userId:z.string().min(23, "Invalid userId").transform((id) => String(id)),
                password: z.string().min(6, "Password must be at least 8 characters long"),
                ConfirmPassword: z.string().min(6, "ConfirmPassword must be at least 8 characters long"),
            })
            .safeParse({
                token,
                userId,
                password,
                ConfirmPassword
            });

        if (parsedCredentials.error) {
            let messages = ''
            parsedCredentials.error.issues.map((i, _) => (
                messages += `${_ > 0 ? ' & ' : ''}` + i.message
            ))
            return NextResponse.json({ type: 'error', resultCode: messages });
        }
        if (parsedCredentials.data?.ConfirmPassword !== parsedCredentials.data?.password) {
            return NextResponse.json({
                type: 'error',
                resultCode: 'Password do not match',
            });
        }
        await connectToDB();

        const user = await Customer.findById(parsedCredentials.data.userId).select('_id reset_token token_expires');

        const isValidToken = user.reset_token === parsedCredentials.data.token;
        const isExpiredToken = user.token_expires > Math.floor(Date.now() / 1000);

        if (!isValidToken || !isExpiredToken) {
            console.log(user.reset_token,user.token_expires);
            console.log(isValidToken,isExpiredToken);
            
            return NextResponse.json({
                type: 'error',
                resultCode: 'Invalid or expired token',
            });
        }

        const hashedPassword = await hash(parsedCredentials.data.password, 10);

        await Customer.findByIdAndUpdate(parsedCredentials.data.userId, {
            password: hashedPassword,
            reset_token: null,
            token_expires: null,
        });

        return NextResponse.json({
            type: 'succes',
            resultCode: 'Password successfully reset',
        });

    } catch (error) {
        const typeErr = error as Error;
        return NextResponse.json({
            type: 'error',
            resultCode: typeErr.message,
        });
    }
}
