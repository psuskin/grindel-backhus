export interface MenuContent {
    name: string;
    ids: number[];
    count: number;
}

export interface Package {
    name: string;
    id: number;
    price: number;
    minimumClients: number;
}

export interface PackageContent {
    [key: string]: MenuContent[];
} 