import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        miniplanes: [],
    },
    reducers: {
        updateMiniplanes: (state, action) => {
            state.miniplanes = [...state.miniplanes, action.payload];
        },
        setMiniplanes: (state, action) => {
            state.miniplanes = action.payload;
        },
    },
})

export const { updateMiniplanes, setMiniplanes } = counterSlice.actions

export const selectMiniplanes = (state) => state.counter.miniplanes

export default counterSlice.reducer
