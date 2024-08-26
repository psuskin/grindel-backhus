// import { NextRequest, NextResponse } from 'next/server';
// import axios, { AxiosResponse } from 'axios';
// import { cookies } from 'next/headers';

// export async function GET(req: NextRequest): Promise<NextResponse> {  // Changed to GET
//     const cookieStore = cookies();
//     const session = cookieStore.get('session')?.value;
//     const ip = req.headers.get('x-real-ip') || '127.0.0.1';
//     const oldIP = cookieStore.get('ClientIP')?.value;

//     // Set the ClientIP cookie
//     cookieStore.set('ClientIP', ip);

//     if (session && oldIP && oldIP === ip) {
//         return NextResponse.json({
//             sessionData: { success: 'true', api_token: session },
//             clientIP: ip,
//         });
//     } else {
//         const formData = new URLSearchParams();
//         formData.append('username', process.env.NEXT_PUBLIC_API_USERNAME || '');
//         formData.append('key', process.env.NEXT_PUBLIC_API_KEY || '');

//         try {
//             const response: AxiosResponse<{ api_token: string }> = await axios.post(
//                 `${process.env.NEXT_PUBLIC_API_ENDPOINT}/account/login`,
//                 formData,
//                 {
//                     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//                 }
//             );

//             const expireDate = new Date();
//             expireDate.setHours(expireDate.getHours() + 2);

//             // Set the session cookie with an expiration time
//             cookieStore.set({
//                 name: 'session',
//                 value: response.data.api_token,
//                 expires: expireDate,
//                 httpOnly: true,
//             });

//             return NextResponse.json({
//                 sessionData: response.data,
//                 clientIP: ip,
//             });
//         } catch (error: any) {
//             cookieStore.delete('session');
//             cookieStore.delete('ClientIP');

//             return NextResponse.json(
//                 { expired: true, error: error.message },
//                 { status: 403 }
//             );
//         }
//     }
// }


import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest): Promise<NextResponse> {
    const cookieStore = cookies();
    const session = cookieStore.get('session')?.value;
    const ip = req.headers.get('x-real-ip') || '127.0.0.1';
    const oldIP = cookieStore.get('ClientIP')?.value;

    // Set the ClientIP cookie
    cookieStore.set('ClientIP', ip, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none', 
        path: '/',
    });

    if (session && oldIP && oldIP === ip) {
        return NextResponse.json({
            sessionData: { success: 'true', api_token: session },
            clientIP: ip,
        });
    } else {
        const formData = new URLSearchParams();
        formData.append('username', process.env.NEXT_PUBLIC_API_USERNAME || '');
        formData.append('key', process.env.NEXT_PUBLIC_API_KEY || '');

        try {
            const response: AxiosResponse<{ api_token: string }> = await axios.post(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/account/login`,
                formData,
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            );

            const expireDate = new Date();
            expireDate.setHours(expireDate.getHours() + 2);

            // Set the session cookie with an expiration time
            const res = NextResponse.json({
                sessionData: response.data,
                clientIP: ip,
            });

            res.cookies.set({
                name: 'session',
                value: response.data.api_token,
                expires: expireDate,
                httpOnly: true,
                secure: true, 
                sameSite: 'none', 
                path: '/',
            });

            return res;
        } catch (error: any) {
            const res = NextResponse.json(
                { expired: true, error: error.message },
                { status: 403 }
            );
            res.cookies.delete('session');
            res.cookies.delete('ClientIP');
            return res;
        }
    }
}