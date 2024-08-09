import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch(
            "https://bowlsgreens.live-website.com/index.php?route=api/product&api_token=1d7a9b7ec26ef7e3b372005a8a"
        );
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
