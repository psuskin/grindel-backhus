import { MENU_CONTENTS, PACKAGES } from "@/constants/categories";

export const getPackageMenuId = (packageName: string): string | null => {
    const pkg = PACKAGES.find(p => p.name === packageName);
    return pkg ? pkg.id.toString() : null;
};

export const getMenuContents = (menuId: string | number): any[] => {
    const id = menuId.toString();
    return MENU_CONTENTS[id] || [];
};

export const getPackageByName = (packageName: string) => {
    return PACKAGES.find(p => p.name === packageName);
};

export const getPackageById = (id: number) => {
    return PACKAGES.find(p => p.id === id);
};

export const getPackagePrice = (packageName: string): number => {
    const pkg = getPackageByName(packageName);
    return pkg ? pkg.price : 0;
};

export const getMinimumClients = (packageName: string): number => {
    const pkg = getPackageByName(packageName);
    return pkg ? pkg.minimumClients : 0;
}; 