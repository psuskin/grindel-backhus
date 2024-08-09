export interface Product {
    product_id: string;
    thumb: string;
    name: string;
    description: string;
    price: string;
    special: boolean | string;
    tax: string;
    minimum: string;
    rating: number;
    href: string;
}