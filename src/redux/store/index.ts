"use client";

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '@/services/api';
import rootReducer from '../reducers';
import sessionReducer from '../slices/sessionSlice';
import loadingReducer from '../slices/loadingSlice';
import extraReducer from '../slices/extraSlice';

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        session: sessionReducer,
        loading: loadingReducer,
        extra: extraReducer,
        ...rootReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
