import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Cart', 'Products', 'Packages'],
    endpoints: (builder) => ({
        getCart: builder.query<any, void>({
            query: () => 'get-cart',
            providesTags: ['Cart'],
        }),
        getProductsByCategory: builder.query<any, string>({
            query: (categoryId) => ({
                url: 'get-products-by-category',
                method: 'POST',
                body: { categoryId },
            }),
            providesTags: ['Products'],
        }),
        addToCart: builder.mutation<any, { id: string; quantity: number }>({
            query: (body) => ({
                url: 'add-main-product',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cart'],
        }),
        editProduct: builder.mutation<any, { id: string; quantity: number }>({
            query: (body) => {
                return {
                    url: 'edit-product',
                    method: 'POST',
                    body: {
                        id: body.id,
                        quantity: body.quantity,
                    },
                };
            },
            invalidatesTags: ['Cart'],
        }),

        removeProduct: builder.mutation<any, { id: string; quantity: number }>({
            query: (body) => ({
                url: 'remove-product',
                method: 'POST',
                body: {
                    id: body.id,
                    quantity: body.quantity.toString(),
                },
            }),
            invalidatesTags: ['Cart'],
        }),
        getPackages: builder.query<any, void>({
            query: () => 'get-packages',
            providesTags: ['Packages'],
        }),
        getMenuContent: builder.query<any, number>({
            query: (menuId) => ({
                url: 'get-menu-content',
                method: 'POST',
                body: { menu: menuId },
            }),
            providesTags: ['Cart'],
        }),
        getProductById: builder.query<any, string>({
            query: (productId) => ({
                url: 'get-product-by-id',
                method: 'POST',
                body: { productId },
            }),
        }),
        getPaymentMethods: builder.query<any, void>({
            query: () => 'get-payment-methods',
        }),
        setPaymentMethod: builder.mutation<any, { payment_method: string }>({
            query: (body) => ({
                url: 'set-payment-method',
                method: 'POST',
                body,
            }),
        }),
        setShippingAddress: builder.mutation<any, {
            firstname: string;
            lastname: string;
            address_1: string;
            city: string;
            country_id: string;
            zone_id: string;
            shipping_address_id: string;
        }>({
            query: (body) => ({
                url: 'set-shipping-address',
                method: 'POST',
                body,
            }),
        }),

        setPaymentAddress: builder.mutation<any, {
            firstname: string;
            lastname: string;
            address_1: string;
            city: string;
            country_id: string;
            zone_id: string;
            payment_address_id: string;
        }>({
            query: (body) => ({
                url: 'set-payment-address',
                method: 'POST',
                body,
            }),
        }),
        getShippingMethod: builder.query<any, void>({
            query: () => 'get-shipping-method',
        }),
        setShippingMethod: builder.mutation<any, { shipping_method: string }>({
            query: (body) => ({
                url: 'set-shipping-method',
                method: 'POST',
                body,
            }),
        }),
        getCategories: builder.query<any, void>({
            query: () => 'get-categories',
        }),
        clearCart: builder.mutation<any, void>({
            query: () => ({
                url: 'clear-cart',
                method: 'POST',
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useGetProductsByCategoryQuery,
    useAddToCartMutation,
    useEditProductMutation,
    useRemoveProductMutation,
    useGetPackagesQuery,
    useGetMenuContentQuery,
    useGetProductByIdQuery,
    useGetPaymentMethodsQuery,
    useSetPaymentMethodMutation,
    useSetShippingAddressMutation,
    useSetPaymentAddressMutation,
    useGetShippingMethodQuery,
    useSetShippingMethodMutation,
    useGetCategoriesQuery,
    useClearCartMutation,
} = api;
