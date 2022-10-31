import { createSlice } from "@reduxjs/toolkit";

export const pregameSlice = createSlice({
    name: 'pregame',
    initialState: {
        value: false,
    },
    reducers: {
        startGame: (state) => {
            state.value = true;
        },
    },
})

export const { startGame } = pregameSlice.actions

export default pregameSlice.reducer