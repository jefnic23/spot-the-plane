import { createSlice } from "@reduxjs/toolkit";

export const timerSlice = createSlice({
    name: 'timer',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state, action) => {
            state.value += parseInt(action.payload);
        },
    },
})

export const { increment } = timerSlice.actions

export const selectTime = (state) => state.timer.value

export default timerSlice.reducer
