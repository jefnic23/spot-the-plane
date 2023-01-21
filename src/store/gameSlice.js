import { createSlice } from "@reduxjs/toolkit";

export const gameSlice = createSlice({
    name: 'game',
    initialState: {
        index: 0,
        value: false
    },
    reducers: {
        setIndex: (state, action) => {
            state.index = action.payload;
        },
        incrementIndex: (state) => {
            state.index += 1;
        },
        endGame: (state) => {
            state.value = true;
        }
    },
})

export const { setIndex, incrementIndex, endGame } = gameSlice.actions

export const selectGameOver = (state) => state.game.value
export const selectIndex = (state) => state.game.index

export default gameSlice.reducer
