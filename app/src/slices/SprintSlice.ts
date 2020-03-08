import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type Comment = {
    id: string
    text: string
    userId: string
}

export type Card = {
    id: string
    text: string
    userId: string
    order: number
    comments: Comment[]
    votes: number
}

export type Column = {
    id: string
    title: string
    order: number
    cards: Card[]
}

type SprintState = {
    sprintid: string | undefined
    columns: Column[]
}

const initialState: SprintState = {
    sprintid: undefined,
    columns: []
}

const name = 'sprint'
const sprintSlice = createSlice({
    name, initialState,
    reducers: {
        setSprintId(state, action: PayloadAction<string>) {
            state.sprintid = action.payload
        },
        addColumn(state, { payload: { id, title } }: PayloadAction<{ id: string, title: string }>) {
            state.columns.push({
                id,
                title,
                cards: [],
                order: state.columns.length
            })
        },
        addCard(state, { payload: { column: columnId, id, text, userId } }: PayloadAction<{ column: string, id: string, text: string, userId: string }>) {
            const column = state.columns.find(c => c.id === columnId)
            if (!column) {
                throw new Error(`Cannot find column ${columnId}`)
            }
            column.cards.push({
                id,
                text: text,
                comments: [],
                votes: 0,
                userId,
                order: column.cards.length
            })
        },
        editColumn(state, { payload: { columnId, title } }: PayloadAction<{ columnId: string, title: string }>) {
            const column = state.columns.find(column => column.id === columnId)
            if (!column) {
                throw new Error(`Cannot find column ${columnId}`)
            }
            column.title = title
        },
        reorderColumn(state, { payload: { fromIndex, index } }: PayloadAction<{ fromIndex: number, index: number }>) {
            console.log(fromIndex, index)
            const column = state.columns.splice(fromIndex, 1)
            state.columns.splice(index, 0, ...column)
        },
        deleteColumn(state, { payload: columnId }: PayloadAction<string>) {
            state.columns = state.columns.filter(column => column.id !== columnId)
        },
        editCard(state, { payload: { cardId, text } }: PayloadAction<{ cardId: string, text: string }>) {
            state.columns.forEach(column => {
                const card = column.cards.find(card => card.id === cardId)
                if (card) {
                    card.text = text
                }
            })
        },
        moveCard(state, { payload: { cardId, columnId } }: PayloadAction<{ cardId: string, columnId: string }>) {
            const fromColumn = state.columns.find(column => column.cards.find(card => card.id === cardId))
            if (!fromColumn) {
                throw new Error(`Cannot find card ${cardId}`)
            }
            if (fromColumn.id !== columnId) {
                const card = fromColumn.cards.find(card => card.id === cardId)!
                state.columns.forEach(column => {
                    if (column.id !== columnId) {
                        column.cards = column.cards.filter(card => card.id !== cardId)
                    } else {
                        column.cards.push(card)
                    }
                })
            }
        },
        deleteCard(state, { payload: cardId }: PayloadAction<string>) {
            state.columns.forEach(column => {
                column.cards = column.cards.filter(card => card.id !== cardId)
            })
        }
    }
})

export const { setSprintId, addColumn, addCard, deleteCard, moveCard, editColumn, editCard, deleteColumn, reorderColumn } = sprintSlice.actions

export default sprintSlice.reducer