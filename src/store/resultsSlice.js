import { createSlice } from "@reduxjs/toolkit";

export const resultsSlice = createSlice({
    name: 'results',
    initialState: {
        noShare: false,
        url: '',
        animation: ''
    },
    reducers: {
        setNoShare: (state, action) => {
            state.noShare = action.payload;
        },
        setUrl: (state, action) => {
            state.url = action.payload;
        },
        setAnimation: (state, action) => {
            state.animation = action.payload;
        }
    },
})

export const { setNoShare, setUrl, setAnimation } = resultsSlice.actions

export const selectNoShare = (state) => state.results.noShare
export const selectUrl = (state) => state.results.url
export const selectAnimation = (state) => state.results.animation

export default resultsSlice.reducer
