import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type SprintState = {
    cards: string[],
    sprintid: string | undefined
}

const initialState: SprintState = {
    cards: [],
    sprintid: undefined
}

const name = 'sprint'
const sprintSlice = createSlice({
    name, initialState,
    reducers: {
        cardAdded(state, action: PayloadAction<string>) {
            state.cards.push(action.payload)
        },
        setSprintId(state, action: PayloadAction<string>) {
            state.sprintid = action.payload
        }
    }
})

export const { setSprintId, cardAdded } = sprintSlice.actions

export default sprintSlice.reducer