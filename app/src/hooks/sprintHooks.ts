import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks"

import { SprintQuery, SprintQueryVariables, SprintDocument, CreateSprintMutation, CreateSprintMutationVariables, CreateSprintDocument, ActionAddedSubscriptionVariables, ActionAddedDocument, CreateActionPayload, CreateActionMutationVariables, CreateActionDocument, Action, ActionAddedSubscription } from "../generated"

import { useDispatch, useSelector } from "react-redux"

import { useEffect } from "react"

import { setSprintId } from "../slices/SprintSlice"

import { RootState } from "../slices"
import { PayloadAction } from "@reduxjs/toolkit"
import clientId from "../clientId"


function useInitSprint(sprintId: string) {
    const { loading: sprintQueryLoading, data } = useQuery<SprintQuery, SprintQueryVariables>(SprintDocument, {
        variables: {
            sprintId: sprintId
        }
    })

    const [addSprint, { loading: createSprintLoading }] = useMutation<CreateSprintMutation, CreateSprintMutationVariables>(CreateSprintDocument)
    const dispatch = useDispatch()

    useEffect(() => {
        async function init({ sprint, actions }: SprintQuery) {
            if (!sprint) {
                console.log('creating sprint')
                await addSprint({
                    variables: {
                        id: sprintId
                    },
                    refetchQueries: [{
                        query: SprintDocument,
                        variables: { sprintId: sprintId! }
                    }]
                })
            }
            if (actions) {
                actions.nodes
                    .map(action => action.payload)
                    .filter(i => i)
                    .forEach(payload => dispatch(payload))
            }
            dispatch(setSprintId(sprintId!))
            console.log('sprint initialized')
        }
        if (!sprintQueryLoading && data) {
            init(data)
        } else {
            console.log('checking if sprint exists')
        }
    }, [sprintQueryLoading, data, sprintId, addSprint, dispatch])

    return createSprintLoading || sprintQueryLoading
}

function useSyncSprint(sprintId: string) {
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
    const sprintid = useSelector((state: RootState) => state.sprint.sprintid)
    const [mutate] = useMutation<CreateActionPayload, CreateActionMutationVariables>(CreateActionDocument)
    const dispatch = useDispatch();
    return async function syncDispatch(action: PayloadAction<unknown>) {
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
    }
}


export function useSprint(sprintId: string) {
    useSyncSprint(sprintId)
    return useInitSprint(sprintId)
}