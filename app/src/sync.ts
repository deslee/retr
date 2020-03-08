import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "./slices";

type SyncMiddleware = Middleware<
    {},
    RootState
>

const syncMiddleware: SyncMiddleware = ({getState, dispatch}) => (next) => async action => {
    const returnValue = next(action)
    return returnValue
}

export default syncMiddleware