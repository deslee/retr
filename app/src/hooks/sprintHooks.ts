import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks"
import { useSnackbar } from 'notistack'
import { SprintQuery, SprintQueryVariables, SprintDocument, CreateSprintMutation, CreateSprintMutationVariables, CreateSprintDocument, ActionAddedSubscriptionVariables, ActionAddedDocument, CreateActionPayload, CreateActionMutationVariables, CreateActionDocument, Action, ActionAddedSubscription } from "../generated"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useCallback } from "react"
import { PayloadAction } from "@reduxjs/toolkit"
import clientId from "../clientId"
import { useParams } from "react-router-dom"
import { Column, setSprintTitle, addColumn, initialized, initializing } from "../slices/SprintSlice"
import { v4 as uuid } from 'uuid'
import { RootState } from "../slices"

export function useSprintId() {
    const { sprintId } = useParams();
    if (!sprintId) {
        throw new Error("Sprint id missing from route params!")
    }

    return sprintId;
}

function useInitSprint() {
    const sprintId = useSprintId()
    const { loading: sprintQueryLoading, data, error } = useQuery<SprintQuery, SprintQueryVariables>(SprintDocument, {
        variables: {
            sprintId: sprintId
        }
    })

    const [addSprint, { loading: createSprintLoading }] = useMutation<CreateSprintMutation, CreateSprintMutationVariables>(CreateSprintDocument)
    const dispatch = useDispatch()
    const initialTitle = useSelector((state: RootState) => state.sprint.initialTitle)
    const initialization = useSelector((state: RootState) => state.sprint.initialization)
    const syncDispatch = useSyncDispatch()
    useSprintLockNotification(initialization)

    if (error) {
        throw error
    }

    useEffect(() => {
        async function init({ sprint, actions }: SprintQuery) {
            console.log('checking if sprint exists')
            if (!sprint) {
                console.log('creating sprint')
                await addSprint({
                    variables: {
                        id: sprintId
                    },
                    refetchQueries: [{
                        query: SprintDocument,
                        variables: { sprintId: sprintId }
                    }]
                })
                if (initialTitle) {
                    syncDispatch(setSprintTitle(initialTitle))
                }
                syncDispatch(addColumn({
                    id: uuid(),
                    title: 'Went well'
                }))
                syncDispatch(addColumn({
                    id: uuid(),
                    title: `Could've gone better`
                }))
                syncDispatch(addColumn({
                    id: uuid(),
                    title: `Action items`
                }))
                syncDispatch(addColumn({
                    id: uuid(),
                    title: `Shout outs`
                }))
            } else if (actions) {
                console.log('hydrating state', actions.nodes)
                await Promise.all(
                    actions.nodes
                        .map(action => action.payload)
                        .filter(i => i)
                        .map(payload => dispatch(payload))
                )
                console.log('hydrated state')
            }
            console.log('sprint initialized')
            dispatch(initialized())
        }
        if (!sprintQueryLoading && data && initialization === 'NOT_INITIALIZED') {
            dispatch(initializing())
            init(data)
        }
    }, [sprintQueryLoading, data, sprintId, addSprint, dispatch, initialTitle, initialization, syncDispatch])

    return [createSprintLoading || sprintQueryLoading, data?.sprint] as const
}

function useSyncSprint() {
    const sprintId = useSprintId()
    const dispatch = useDispatch()
    const { data } = useSubscription<ActionAddedSubscription, ActionAddedSubscriptionVariables>(ActionAddedDocument, {
        variables: { topic: `${sprintId}:actions` }
    })
    useEffect(() => {
        async function act(action: Pick<Action, 'id' | 'type' | 'userid' | 'timestamp' | 'payload'>) {
            if (action.userid !== clientId) {
                dispatch(action.payload)
            }
        }
        if (data?.listen.relatedNode?.__typename === 'Action') {
            act(data.listen.relatedNode)
        }
    }, [data, dispatch])
}

export function useSyncDispatch() {
    const sprintid = useSprintId();
    const [mutate] = useMutation<CreateActionPayload, CreateActionMutationVariables>(CreateActionDocument)
    const dispatch = useDispatch();
    return useCallback(async function syncDispatch(action: PayloadAction<unknown>) {
        dispatch(action)
        await mutate({
            variables: {
                type: action.type.toString(),
                timestamp: new Date(),
                userId: clientId,
                sprintId: sprintid!,
                payload: action
            }
        })
    }, [dispatch, mutate, sprintid]);
}

export function useSprint() {
    useSyncSprint()
    return useInitSprint()
}

export function useColumnNavigation(columns: Column[]) {
    const [visibleColumnIdx, setVisibleColumnIdx] = useState(0)
    const visibleColumn = columns[visibleColumnIdx]
    useEffect(() => {
        if (!visibleColumn) {
            setVisibleColumnIdx(0)
        }
    }, [visibleColumnIdx, visibleColumn])
    const onPrevColumn = useCallback(() => {
        setVisibleColumnIdx(visibleColumnIdx - 1)
    }, [visibleColumnIdx])
    const onNextColumn = useCallback(() => {
        setVisibleColumnIdx(visibleColumnIdx + 1)
    }, [visibleColumnIdx])
    return {
        onPrevColumn, onNextColumn,
        hasPrevColumn: visibleColumnIdx !== 0, hasNextColumn: visibleColumnIdx !== columns.length - 1,
        visibleColumn, visibleColumnIdx
    }
}

export function useSprintLockNotification(initialization: RootState['sprint']['initialization']) {
    const sprintLocked = useSelector((state: RootState) => state.sprint.locked)
    const [previousLocked, setPreviousLocked] = useState(sprintLocked)
    const { enqueueSnackbar } = useSnackbar()

    useEffect(() => {
        setPreviousLocked(sprintLocked)
        if (previousLocked !== sprintLocked && initialization === 'INITIALIZED') {
            enqueueSnackbar(`Sprint ${sprintLocked ? 'locked' : 'unlocked'}`, { variant: 'info' })
        }
    }, [sprintLocked, previousLocked, setPreviousLocked, initialization, enqueueSnackbar])
}