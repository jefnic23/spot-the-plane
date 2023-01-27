import { createSlice } from "@reduxjs/toolkit";

export const quoteSlice = createSlice({
    name: 'quote',
    initialState: {
        quote: '',
        author: ''
    },
    reducers: {
        setQuote: (state, action) => {
            state.quote = action.payload.quote;
            state.author = action.payload.author;
        },
    },
})

export const { setQuote } = quoteSlice.actions

export const selectQuote = (state) => state.quote.quote
export const selectAuthor = (state) => state.quote.author

export default quoteSlice.reducer