import { signIn } from "@/auth";
import { createUser } from "@/lib/actions/actions";
import { ResultCode } from "@/lib/utils/features";
import { genSalt, hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    const body = await req.json();
    const { email ,password} = body;

    const parsedCredentials = z
        .object({
            email: z.string().email(),
            password: z.string().min(6)
        })
        .safeParse({
            email,
            password
        })

    if (parsedCredentials.success) {
        const salt = await genSalt(10);

        const hashedPassword = await hash(password, salt);

        try {
            const result = await createUser(email, hashedPassword);

            if (result.resultCode === ResultCode.UserCreated) {
                await signIn('credentials', {
                    email,
                    password,
                    redirect: false
                });
            }
            return NextResponse.json(result);
        } catch (error) {
            console.error("Error in signup process:", error); // Log detailed error to the console

            if (error instanceof AuthError) {
                switch (error.type) {
                    case 'CredentialsSignin':
                        return NextResponse.json({ type: 'error', resultCode: ResultCode.InvalidCredentials });
                    default:
                        return NextResponse.json({ type: 'error', resultCode: error.message });
                }
            } else {
                const typeErr = error as Error
                return NextResponse.json({ type: 'error', resultCode: typeErr.message });
            }
        }
    } else {
        return NextResponse.json({ type: 'error', resultCode: ResultCode.InvalidSubmission });
    }
}
