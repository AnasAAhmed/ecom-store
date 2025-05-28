
import { getUser } from "@/lib/actions/user.actions";
import { corsHeaders } from "@/lib/cors";
import { ResultCode } from "@/lib/utils/features";
import { compare } from "bcryptjs";
import { encode } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { z } from "zod";

export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;
    try {
        const ip = (await headers()).get('x-forwarded-for') || '36.255.42.109';
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
        const geoData = await geoRes.json();
        const userAgent = (await headers()).get('user-agent') || '';
        const parser = new UAParser(userAgent);
        const result = parser.getResult();
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

        const os = `${result.os.name} ${result.os.version}`;
        const device = result.device.type || "Desktop";
        const browser = `${result.browser.name} ${result.browser.version}`;

        const parsedCredentials = z
            .object({
                email: z.string().email(),
                password: z.string().min(6, 'Password must contain 6 characters')
            })
            .safeParse({
                email,
                password
            })

        if (parsedCredentials.error) {
            let messages = ''
            parsedCredentials.error.issues.map((i, _) => (
                messages += `${_ > 0 ? ' & ' : ''}` + i.message
            ))
            return NextResponse.json({ type: 'error', resultCode: messages }, { status: 401, headers: corsHeaders });

        }
        const user: User | null = await getUser({ email: parsedCredentials.data.email, provider: 'credentials', browser, city, country, ip, userAgent, os, device });
        if (!user) {
            return NextResponse.json({ type: 'error', resultCode: ResultCode.InvalidCredentials }, { status: 401, headers: corsHeaders });

        }
        if (user.role !== 'admin') {
            return NextResponse.json({ type: 'error', resultCode: 'Access Denied for non-admin' }, { status: 401, headers: corsHeaders });

        }
        const isMatched = await compare(parsedCredentials.data.password, user.password!);
        if (!isMatched) {
            return NextResponse.json({ type: 'error', resultCode: ResultCode.InvalidCredentials }, { status: 401, headers: corsHeaders });

        }
        const token = await encode({
            token: {
                email,
                id: user.id,
                name: user.name,
                image: user.image,
                role: user.role,
                isAdmin: user.role === 'admin',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
            },
            secret: process.env.AUTH_SECRET!,
            salt: process.env.ADMIN_SALT!
        });
        const response = NextResponse.json({ type: "succes", resultCode: 'Login successful' }, { status: 200, headers: corsHeaders });

        response.cookies.set({
            name: 'authjs.admin-session',
            value: token,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });
        console.log(response);
        
        return response;
    } catch (error) {
        return NextResponse.json({ type: 'error', resultCode: 'Login: ' + (error as Error).message }, { status: 500, headers: corsHeaders });
    }
}
