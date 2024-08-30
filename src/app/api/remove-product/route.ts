import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        // Retrieve the session token from cookies
        const session = cookies().get("session")?.value;

        // If there's no session token, return an unauthorized error
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse the request body to get the product ID and quantity
        const { id, quantity } = await req.json();

        if (!id || quantity === undefined) {
            return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 });
        }

        // Prepare form data for the request
        const formData = new FormData();
        formData.append("key", id);
        formData.append("quantity", quantity.toString());  // Convert to string

        // Make the POST request to your external API
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/sale/cart.remove&api_token=${session}`,
            formData
        );

        // Return the API response
        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        console.error("Remove product error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}
