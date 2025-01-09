import { CartData, PackageOrder } from "@/types/packageOrders";
import { getPackageMenuId, getMenuContents } from "@/utils/menuUtils";

export const calculateExtrasTotal = (cartData: CartData): number => {
    if (!cartData?.cart?.order) return 0;

    const orderArray = Array.isArray(cartData.cart.order)
        ? cartData.cart.order
        : Object.values(cartData.cart.order);

    return orderArray.reduce((total: number, pkg: PackageOrder) => {
        if (!pkg?.products) return total;

        // Get menu ID and contents
        const menuId = getPackageMenuId(pkg.package);
        const menuContents = cartData?.cart?.menu?.contents ||
            (menuId ? getMenuContents(menuId) : []);

        // Get extra category IDs
        const extraIds = menuContents?.find(
            content => content.name === "Extras"
        )?.ids || [74];  // Default to 74 for Extras

        // Calculate extras total
        return total + Object.entries(pkg.products).reduce(
            (packageTotal, [categoryId, products]) => {
                // Only include products from extra categories
                if (!extraIds.includes(parseInt(categoryId))) return packageTotal;

                if (Array.isArray(products)) {
                    return packageTotal + products.reduce((productTotal, product) => {
                        return productTotal + (product.total || 0);
                    }, 0);
                }
                return packageTotal;
            }, 0
        );
    }, 0);
};

export const calculateTotals = (cartData: CartData, extrasTotal: number) => {
    try {
        let calculatedTotal = 0;

        if (cartData?.cart?.order) {
            const packages = Array.isArray(cartData.cart.order)
                ? cartData.cart.order
                : Object.values(cartData.cart.order);

            packages.forEach((pkg: PackageOrder) => {
                // Base package price = package price × number of guests
                const basePackagePrice = pkg.price * (pkg.guests || 1);

                // Add products with quantity >= 10 and divisible by 10
                let productsOver5Total = 0;
                Object.values(pkg.products).forEach((products) => {
                    products.forEach((product) => {
                        const quantity = Number(product.quantity);
                        if (quantity >= 5 && quantity % 5 === 0 && product.price > 0) {
                            productsOver5Total += product.total;
                        }
                    });
                });

                calculatedTotal += basePackagePrice + productsOver5Total;
            });
        }

        return {
            subTotal: calculatedTotal.toFixed(2) + "€",
            totalPrice: (calculatedTotal + extrasTotal).toFixed(2) + "€",
        };
    } catch (error) {
        console.error("Error calculating totals:", error);
        return { subTotal: "0.00€", totalPrice: "0.00€" };
    }
};

export const formatExtrasTotal = (extrasTotal: number): string => {
    return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
    }).format(extrasTotal);
}; 