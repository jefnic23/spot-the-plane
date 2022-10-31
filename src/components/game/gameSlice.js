import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
    name: 'game',
    initialState: {
        value: false,
    },
    reducers: {
        endGame: (state) => {
            state.value = true;
        },
    },
})

export const { endGame } = gameSlice.actions

export default gameSlice.reducer