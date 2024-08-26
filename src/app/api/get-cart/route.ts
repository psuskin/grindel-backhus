import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {
        // Retrieve the session token from cookies
        const cookieStore = cookies();
        const session = cookieStore.get('session')?.value;

        // If there's no session token, return an unauthorized error
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Make a POST request to the backend API to get the cart
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sale/cart`,
            {},
            {
                headers: { "Content-Type": "multipart/form-data" },
                params: { api_token: session },
            }
        );


        // Return the response data from the backend API
        return NextResponse.json(response.data, { status: 200 });
    } catch (error: unknown) {
        // Log the error and return a failure response
        console.error("Get Cart Error:", error);
        return NextResponse.json(
            {
                expired: true,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            },
            { status: 500 }
        );
    }
}
