import { createSlice } from "@reduxjs/toolkit";

export const timerSlice = createSlice({
    name: 'timer',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state, action) => {
            state.value += action.payload
        },
    },
})

export const { increment } = timerSlice.actions

export default timerSlice.reducer
