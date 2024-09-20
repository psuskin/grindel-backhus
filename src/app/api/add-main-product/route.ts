import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        // Retrieve session from cookies
        const session = cookies().get("session")?.value;

        // If session is missing, return unauthorized response
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, quantity } = await req.json();

        // Prepare the form data for the POST request
        const formData = new FormData();
        formData.append("product_id", id);
        formData.append("quantity", String(quantity));

        // Make the POST request to your external API
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sale/cart.add`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
                params: { api_token: session },
            }
        );

        // Return the response data back to the client
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error("Add main product error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}
