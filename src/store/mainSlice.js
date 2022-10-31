import { createSlice } from "@reduxjs/toolkit";

export const mainSlice = createSlice({
    name: 'main',
    initialState: {
        day: null,
    },
    reducers: {
        setDay: (state, action) => {
            state.day = action.payload
        },
    },
})

export const { setDay } = mainSlice.actions

export const selectDay = (state) => state.main.day

export default mainSlice.reducer