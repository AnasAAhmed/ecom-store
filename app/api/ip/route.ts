
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
// import { UAParser } from 'ua-parser-js';

export async function GET(req: NextRequest) {

    try {
        const ip = (await (headers())).get('x-forwarded-for') || '36.255.42.109';
        // const userAgent = (await (headers())).get('user-agent') || '';
        // const parser = new UAParser(userAgent);
        // const result = parser.getResult();

        let country = "";
        let city = "";
        let countryCode = "";

        if (ip && ip !== '::1' && ip !== '127.0.0.1') {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
            const geoData = await geoRes.json();
            country = geoData.country || 'Unknown';
            city = geoData.city || 'Unknown';
            countryCode = geoData.countryCode || "hell";

        } else {
            country = "Localhost";
            city = "Localhost";
            countryCode = "hell";
            console.log("Skipping geo lookup for local IP:", ip);
        }

        // const os = `${result.os.name} ${result.os.version}`;
        // const device = result.device.type || "Desktop";
        // const browser = `${result.browser.name} ${result.browser.version}`;

        return NextResponse.json({
            country,
            city,
            countryCode,
        }, {
            status: 200,
            headers: {
                "Cache-Control": "private, max-age=120, stale-while-revalidate=59",
            },
        });
    } catch (err) {
        return NextResponse.json((err as Error).message, { status: 500, statusText: (err as Error).message });
    }
}
