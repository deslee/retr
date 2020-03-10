import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

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
    votes: string[]
    children: Card[]
}

export type Column = {
    id: string
    title: string
    order: number
    cards: Card[]
}

type SprintState = {
    title: string,
    columns: Column[],
    locked: boolean,
    initialTitle?: string
    initialization: 'NOT_INITIALIZED' | 'INITIALIZING' | 'INITIALIZED'
}

const initialState: SprintState = {
    title: 'New Sprint',
    columns: [],
    locked: false,
    initialization: 'NOT_INITIALIZED'
}

const name = 'sprint'
const sprintSlice = createSlice({
    name, initialState,
    reducers: {
        setSprintTitle(state, action: PayloadAction<string>) {
            state.title = action.payload
            state.initialTitle = undefined;
        },
        setInitialTitle(state, action: PayloadAction<string>) {
            state.initialTitle = action.payload
        },
        initializing(state) {
            state.initialization = 'INITIALIZING'
        },
        initialized(state) {
            state.initialization = 'INITIALIZED'
        },
        toggleLock(state) {
            state.locked = !state.locked
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
                votes: [],
                userId,
                order: column.cards.length,
                children: []
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
        reorderCard(state, { payload: { column: columnId, fromIndex, index } }: PayloadAction<{ column: string, fromIndex: number, index: number }>) {
            const column = state.columns.find(c => c.id === columnId)
            if (!column) {
                throw new Error(`Cannot find column ${columnId}`)
            }
            const card = column.cards.splice(fromIndex, 1);
            column.cards.splice(index, 0, ...card)
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
        },
        voteCard(state, { payload: { cardId, userId } }: PayloadAction<{ cardId: string, userId: string }>) {
            const card = state.columns.find(column => column.cards.find(card => card.id === cardId))?.cards.find(card => card.id === cardId)
            if (!card) {
                throw new Error(`Cannot find card ${cardId}`)
            }
            if (card.votes.indexOf(userId) === -1) {
                card.votes.push(userId)
            } else {
                card.votes = card.votes.filter(v => v !== userId)
            }
        },
        commentCard(state, { payload: { cardId, userId, text } }: PayloadAction<{ cardId: string, userId: string, text: string }>) {
            const card = state.columns.find(column => column.cards.find(card => card.id === cardId))?.cards.find(card => card.id === cardId)
            if (!card) {
                throw new Error(`Cannot find card ${cardId}`)
            }
            card.comments.push({
                id: uuid(),
                userId,
                text
            })
        },
        nestCard(state, { payload: { parentCardId, childCardId } }: PayloadAction<{ parentCardId: string, childCardId: string }>) {
            const parentCard = state.columns.find(column => column.cards.find(card => card.id === parentCardId))?.cards.find(card => card.id === parentCardId)
            if (!parentCard) {
                throw new Error(`Cannot find card ${parentCardId}`)
            }
            const childCard = state.columns.find(column => column.cards.find(card => card.id === childCardId))?.cards.find(card => card.id === childCardId)
            if (!childCard) {
                throw new Error(`Cannot find card ${childCardId}`)
            }

            state.columns.forEach(column => {
                column.cards = column.cards.filter(card => card.id !== childCardId)
            })

            parentCard.children.push(childCard)
        }
    }
})

export const { setSprintTitle, addColumn, addCard, deleteCard, moveCard, editColumn, editCard, deleteColumn, reorderColumn, voteCard, commentCard, nestCard, toggleLock, setInitialTitle, initialized, initializing } = sprintSlice.actions

export default sprintSlice.reducer