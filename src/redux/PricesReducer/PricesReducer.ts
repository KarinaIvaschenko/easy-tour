import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    pricesList: []
}

const pricesSlice = createSlice({
    name: "PricesReducer",
    initialState,
    reducers: {
        resetState: () => initialState,
        setPricesList: (state, action) => {
            state.pricesList = action.payload;
        }
    }
})

export const {resetState, setPricesList} = pricesSlice.actions;
export default pricesSlice.reducer;