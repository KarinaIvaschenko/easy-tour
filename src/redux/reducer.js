import {combineReducers} from "@reduxjs/toolkit";
import PricesReducer from "./PricesReducer/PricesReducer.js";

const rootReducer = combineReducers({PricesReducer});

export default rootReducer;