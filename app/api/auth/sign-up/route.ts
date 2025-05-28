import { signIn } from "@/auth";
import { createUser } from "@/lib/actions/user.actions";
import { ResultCode } from "@/lib/utils/features";
import { genSalt, hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { UAParser } from 'ua-parser-js';
import { headers } from "next/headers";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;
    try {
        const parsedCredentials = z
            .object({
                email: z.string().email(),
                password: z.string().min(6, 'Password must contain 6 characters')
            })
            .safeParse({
                email,
                password
            });

        if (parsedCredentials.success) {
            const ip = (await headers()).get('x-forwarded-for') || '36.255.42.109';
            const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
            const geoData = await geoRes.json();
            const userAgent = (await headers()).get('user-agent') || '';
            const parser = new UAParser(userAgent);
            const resultAgent = parser.getResult();

            let country = "oooo";
            let city = "pppp";

            if (ip && ip !== '::1' && ip !== '127.0.0.1') {
                country = geoData.country || 'Unknown';
                city = geoData.city || 'Unknown';
            } else {
                country = "Localhost";
                city = "Localhost";
                console.log("Skipping geo lookup for local IP:", ip);
            }

            const os = `${resultAgent.os.name} ${resultAgent.os.version}`;
            const device = resultAgent.device.type || "Desktop";
            const browser = `${resultAgent.browser.name} ${resultAgent.browser.version}`;
            const salt = await genSalt(10);

            const hashedPassword = await hash(password, salt);

            const createdUser = await createUser({ email, hashedPassword, browser, city, country, ip, userAgent, os, device, isSigningUpUserWithCredientials: true });

            if (createdUser) {
                await signIn('credentials', {
                    email,
                    id: createdUser.id,
                    username: createdUser.name,
                    image: createdUser.image,
                    redirect: false
                });
            } else {
                return NextResponse.json({ type: 'error', resultCode: ResultCode.UserAlreadyExists });
            }

            return NextResponse.json({ type: 'sucess', resultCode: ResultCode.UserCreated });


        } else {
            let messages = ''
            parsedCredentials.error.issues.map((i, _) => (
                messages += `${_ > 0 ? ' & ' : ''}` + i.message
            ))
            return NextResponse.json({ type: 'error', resultCode: messages });
        }
    } catch (error) {
        console.error("Error in signup process:", error);
        const typeErr = error as Error
        return NextResponse.json({ type: 'error', resultCode: typeErr.message as string, });
    }
}
