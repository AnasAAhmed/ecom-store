import { signIn } from "@/auth";
import { ResultCode } from "@/lib/utils/features";
import { AuthError } from "next-auth";
import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { z } from "zod";

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;
    const userAgent = req.headers.get('x-user-agent') || '';
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const forwardedFor = req.headers.get("x-real-ip");
    // const ip = "101.50.68.144";
    const ip = forwardedFor?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || " 101.50.68.144";

    const os = `${result.os.name} ${result.os.version}`;
    const device = result.device.type || "Desktop";
    const browser = `${result.browser.name} ${result.browser.version}`;

    try {

        const parsedCredentials = z
            .object({
                email: z.string().email(),
                password: z.string().min(6)
            })
            .safeParse({
                email,
                password
            })

        if (parsedCredentials.error) {
            return NextResponse.json({ type: 'error', resultCode: ResultCode.InvalidSubmission });

        }
        let country = "ddddd";
        let city = "ssss";

        if (ip) {
            // if (ip && ip !== '::1' && ip !== '127.0.0.1') {
            try {
                const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
                const geoData = await geoRes.json();
                country = geoData.country || 'unknown';
                city = geoData.city || 'unknown';
                console.log("Geo:", city, country);
            } catch (geoErr) {
                console.warn("Geo lookup failed:", geoErr);
            }
        } else {
            country = "localhost";
            city = "localhost";
            console.log("Skipping geo lookup for local IP:", ip);
        }

        await signIn('credentials', {
            email,
            password,
            ip,
            userAgent,
            country,
            city,
            browser,
            device,
            os,
            redirect: false
        });

        return NextResponse.json({ type: 'success', resultCode: ResultCode.UserLoggedIn });


    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return NextResponse.json({ type: 'error', resultCode: ResultCode.InvalidCredentials });

                default:
                    return NextResponse.json({ type: 'error', resultCode: ResultCode.UnknownError });

            }
        }
    }
}
