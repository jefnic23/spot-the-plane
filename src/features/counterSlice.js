import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        used: false,
        red: 0,
        green: 255,
        blue: 255,
        opacity: 0.21,
    },
    reducers: {
        increment: (state) => {
            state.red += 1;
            state.green -= 1;
        },
    },
})