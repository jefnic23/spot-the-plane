import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        miniplanes: [],
    },
    reducers: {
        updateMiniplanes: (state, rgb) => {
            state.miniplanes = [...state.miniplanes, rgb.payload]
        },
    },
})

export const { updateMiniplanes } = counterSlice.actions

export default counterSlice.reducer
