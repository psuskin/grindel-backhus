"use client";

// import { configureStore } from "@reduxjs/toolkit";
// import grindelBackhus from "../reducers";

// export type RootState = ReturnType<typeof grindelBackhus>;
// const store = configureStore({
//     reducer: grindelBackhus,
// });


// export default store;

// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit';
import grindelBackhus from "../reducers";


export const store = configureStore({
    reducer: grindelBackhus,
    // Remove the middleware configuration since thunk is included by default
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;