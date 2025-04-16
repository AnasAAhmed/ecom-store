import { signIn } from "@/auth";
import { createUser } from "@/lib/actions/actions";
import { ResultCode } from "@/lib/utils/features";
import { genSalt, hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { UAParser } from 'ua-parser-js';

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;
    const userAgent = req.headers.get('x-user-agent') || '';
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const os = `${result.os.name} ${result.os.version}`;
    const device = result.device.type || "Desktop";
    const browser = `${result.browser.name} ${result.browser.version}`;

    const parsedCredentials = z
        .object({
            email: z.string().email(),
            password: z.string().min(6)
        })
        .safeParse({
            email,
            password
        });

    if (!parsedCredentials.success) {
        return NextResponse.json({ type: 'error', resultCode: ResultCode.InvalidSubmission });
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const forwardedFor = req.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";

    let country = "Unknown";
    let city = "Unknown";
    console.log('ip', ip);

    if (ip && ip !== '::1' && ip !== '127.0.0.1') {
        try {
            const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
            if (geoRes.ok) {
                const geoData = await geoRes.json();
                country = geoData.country_name || "Unknown";
                city = geoData.city || "Unknown";
                console.log(city, country);
            }
        } catch (geoErr) {
            console.warn("Geo lookup failed:", geoErr);
        }
    } else {
        country = "from local host";
        city = "from local host";
        console.log("Skipping geo lookup for local IP:", ip);
    }


    try {
        const result = await createUser(email, hashedPassword,ip, userAgent, country, city, browser, device, os);

        if (result.resultCode === ResultCode.UserCreated) {
            await signIn('credentials', {
                email,
                password,
                redirect: false
            });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in signup process:", error);

        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return NextResponse.json({ type: 'error', resultCode: ResultCode.InvalidCredentials });
                default:
                    return NextResponse.json({ type: 'error', resultCode: error.message });
            }
        } else {
            const typeErr = error as Error;
            return NextResponse.json({ type: 'error', resultCode: typeErr.message });
        }
    }
}
