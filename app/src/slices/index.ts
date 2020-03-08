import { combineReducers, ThunkAction, Action } from '@reduxjs/toolkit'
import sprintReducer from './SprintSlice'

export const rootReducer = combineReducers({
    sprint: sprintReducer
})

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export type RootState = ReturnType<typeof rootReducer>