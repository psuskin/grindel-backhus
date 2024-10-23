// export interface Product {
//     product_id: string;
//     thumb: string;
//     name: string;
//     description: string;
//     price: string;
//     special: boolean | string;
//     tax: string;
//     minimum: string;
//     rating: number;
//     href: string;
//     allergenFree: string[];
//     category: string;
// }

import { ReactNode } from "react";

// export interface Product {
//     product_id: string;
//     name: string;
//     price: string;
//     category: string;
//     allergenFree?: string[];
//     // Add other product properties as needed
// }

export interface Filters {
    categories?: string[];
    allergens?: string[];
}


export interface Product {
    quantity: ReactNode;
    cart_id: string;
    product_id: string;
    thumb: string;
    name: string;
    description?: string; // Optional
    price: string;
    special?: boolean; // Optional
    tax?: string; // Optional
    minimum?: string; // Optional
    rating?: string; // Optional
    href?: string;
    category: string; // Assuming this might be optional based on your context
  category_id?: string;
  addedExtras?: any;
}
export interface CartItem extends Omit<Product, 'cart_id'> {
    quantity: number;
    cart_id: string;
  }