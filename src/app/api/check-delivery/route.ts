import { NextResponse } from 'next/server';
import axios from 'axios';

const GRINDEL_ADDRESS = "Grindelhof 11, 20146 Hamburg, Germany";
const GRINDEL_COORDINATES = {
    lat: 53.5684491,
    lng: 9.9830894
};

if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    throw new Error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined in environment variables');
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Hamburg postal code ranges
const HAMBURG_POSTAL_CODES = {
    ranges: [
        { min: 20095, max: 21149 },
        { min: 22041, max: 22769 }
    ]
};

// Hamburg bounding box coordinates
const HAMBURG_BOUNDS = {
    north: 53.7541,
    south: 53.3951,
    east: 10.3261,
    west: 9.7145
};

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

interface GeocodeResult {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

function getAddressComponent(components: AddressComponent[], type: string): string | null {
    const component = components.find(comp => comp.types.includes(type));
    return component ? component.long_name : null;
}

function isLocationInHamburg(lat: number, lng: number): boolean {
    return lat >= HAMBURG_BOUNDS.south &&
        lat <= HAMBURG_BOUNDS.north &&
        lng >= HAMBURG_BOUNDS.west &&
        lng <= HAMBURG_BOUNDS.east;
}

function isValidHamburgPostalCode(postalCode: string): boolean {
    const code = parseInt(postalCode);
    return HAMBURG_POSTAL_CODES.ranges.some(range =>
        code >= range.min && code <= range.max
    );
}

function isValidHamburgAddress(addressResult: GeocodeResult): {
    isValid: boolean;
    reason?: string;
} {
    if (!addressResult || !Array.isArray(addressResult.address_components)) {
        return {
            isValid: false,
            reason: "Entschuldigung, wir konnten Ihre Adresse nicht validieren. Bitte überprüfen Sie Ihre Eingabe."
        };
    }

    const components = addressResult.address_components;
    const location = addressResult.geometry.location;

    // Get all required components
    const streetNumber = getAddressComponent(components, 'street_number');
    const route = getAddressComponent(components, 'route');
    const postalCode = getAddressComponent(components, 'postal_code');
    const locality = getAddressComponent(components, 'locality')?.toLowerCase();

    // Validate street address first
    if (!streetNumber || !route) {
        return {
            isValid: false,
            reason: "Bitte geben Sie eine vollständige Straßenadresse mit Hausnummer ein"
        };
    }

    // Validate city
    if (!locality || !locality.includes('hamburg')) {
        return {
            isValid: false,
            reason: "Adresse liegt außerhalb des Liefergebiets"
        };
    }

    // Validate postal code format
    if (!postalCode || !/^\d{5}$/.test(postalCode)) {
        return {
            isValid: false,
            reason: "Bitte geben Sie eine gültige Postleitzahl ein (5 Ziffern)"
        };
    }

    // Check if postal code is in Hamburg range
    if (!isValidHamburgPostalCode(postalCode)) {
        return {
            isValid: false,
            reason: "Adresse liegt außerhalb des Liefergebiets"
        };
    }

    // Final check for Hamburg bounds
    if (!isLocationInHamburg(location.lat, location.lng)) {
        return {
            isValid: false,
            reason: "Adresse liegt außerhalb des Liefergebiets"
        };
    }

    return { isValid: true };
}

// Calculate straight-line distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function formatDeliveryMessage(distance: number, validationResult: { isValid: boolean; reason?: string }): {
    message: string;
    fee: number | null;
    isAvailable: boolean;
    status: 'success' | 'warning' | 'error';
} {
    const distanceKm = distance / 1000;

    if (!validationResult.isValid) {
        return {
            message: validationResult.reason || 'Ungültige Adresse',
            fee: null,
            isAvailable: false,
            status: 'error'
        };
    }

    // Under 5km = Free delivery
    if (distanceKm < 5) {
        return {
            message: 'Kostenlose Lieferung möglich',
            fee: 0,
            isAvailable: true,
            status: 'success'
        };
    }
    // 5-20km = 15€
    else if (distanceKm >= 5 && distanceKm <= 20) {
        return {
            message: 'Lieferung verfügbar',
            fee: 15,
            isAvailable: true,
            status: 'warning'
        };
    }
    // Over 20km = Not Available
    else {
        return {
            message: 'Leider außerhalb des Liefergebiets',
            fee: null,
            isAvailable: false,
            status: 'error'
        };
    }
}

export async function POST(request: Request) {
    try {
        const { address, city, postalCode } = await request.json();

        // Construct full address with provided components
        const fullAddress = `${address}, ${postalCode} ${city}, Germany`;

        const geocodeResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${API_KEY}&region=de&language=de`
        );

        if (geocodeResponse.data.status !== "OK") {
            return NextResponse.json({
                success: false,
                message: "Die Adresse konnte nicht gefunden werden. Bitte überprüfen Sie Ihre Eingabe.",
                isDeliveryAvailable: false
            });
        }

        const addressResult = geocodeResponse.data.results[0];
        const validationResult = isValidHamburgAddress(addressResult);

        if (!validationResult.isValid) {
            return NextResponse.json({
                success: true,
                isDeliveryAvailable: false,
                message: `${validationResult.reason}`,
                fullAddress: addressResult.formatted_address
            });
        }

        const location = addressResult.geometry.location;
        const distance = calculateDistance(
            GRINDEL_COORDINATES.lat,
            GRINDEL_COORDINATES.lng,
            location.lat,
            location.lng
        );

        const { message, fee, isAvailable } = formatDeliveryMessage(distance, validationResult);

        return NextResponse.json({
            success: true,
            distance: Math.round(distance),
            distanceKm: (distance / 1000).toFixed(1),
            validationResult,
            deliveryFee: fee,
            isDeliveryAvailable: isAvailable,
            message,
            fullAddress: addressResult.formatted_address
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: 'Fehler bei der Überprüfung der Lieferadresse. Bitte versuchen Sie es erneut.'
            },
            { status: 400 }
        );
    }
} 