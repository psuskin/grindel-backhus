interface MenuContent {
    name: string;
    ids: number[];
    count: number;
}

interface PackageContent {
    [key: string]: MenuContent[];
}

export const MENU_CONTENTS: PackageContent = {
    "1": [
        { name: "Salate", ids: [75], count: 2 },
        { name: "Dips", ids: [76], count: 1 },
        { name: "Desserts", ids: [73], count: 1 },
        { name: "Extras", ids: [74, 73], count: 0 }
    ],
    "2": [
        { name: "Salate", ids: [75], count: 4 },
        { name: "Dips", ids: [76], count: 2 },
        { name: "Desserts", ids: [73], count: 2 },
        { name: "Extras", ids: [74, 73], count: 0 }
    ],
    "3": [
        { name: "Salate", ids: [75], count: 6 },
        { name: "Dips", ids: [76], count: 2 },
        { name: "Desserts", ids: [73], count: 3 },
        { name: "Extras", ids: [74, 73], count: 0 }
    ],
    "4": [
        { name: "Kanapees & Spieße", ids: [70, 72], count: 3 },
        { name: "Extras", ids: [74, 73], count: 0 }
    ],
    "5": [
        { name: "Kanapees & Spieße", ids: [70, 72], count: 4 },
        { name: "Extras", ids: [74, 73], count: 0 }
    ],
    "6": [
        { name: "Kanapees & Spieße", ids: [70, 72], count: 6 },
        { name: "Extras", ids: [74, 73], count: 0 }
    ],
    "7": [
        { name: "Halbe", ids: [60], count: 20 },
        { name: "Extras", ids: [74, 73], count: 0 }
    ],
    "8": [
        { name: "Halbe", ids: [60], count: 30 },
        { name: "Wraps", ids: [77], count: 10 },
        { name: "Extras", ids: [74, 73], count: 0 }
    ],
    "9": [
        { name: "Halbe", ids: [60], count: 40 },
        { name: "Ganze", ids: [61, 62, 63, 64, 65, 66, 67, 68], count: 10 },
        { name: "Wraps", ids: [77], count: 15 },
        { name: "Extras", ids: [74, 73], count: 0 }
    ]
};

export const PACKAGES = [
    { name: "Office Menü (Basic)", id: 7, price: 5, minimumClients: 10 },
    { name: "Office Menü (Classic)", id: 8, price: 5.7, minimumClients: 20 },
    { name: "Office Menü (Premium)", id: 9, price: 6.4, minimumClients: 40 },
    { name: "Salat Buffet Menü (Basic)", id: 1, price: 12.5, minimumClients: 10 },
    { name: "Salat Buffet Menü (Classic)", id: 2, price: 15.9, minimumClients: 20 },
    { name: "Salat Buffet Menü (Premium)", id: 3, price: 19.9, minimumClients: 30 },
    { name: "Fingerfood Menü (Basic)", id: 4, price: 10.5, minimumClients: 1 },
    { name: "Fingerfood Menü (Classic)", id: 5, price: 12, minimumClients: 1 },
    { name: "Fingerfood Menü (Premium)", id: 6, price: 15, minimumClients: 1 }
]; 