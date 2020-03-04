import React, { useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom'
import { SprintDocument, SprintQuery, SprintQueryVariables, CreateSprintDocument, CreateSprintMutationVariables, CreateSprintMutation } from '../generated';
import Board from './Board';

const Sprint: React.FC = () => {
    const { sprintId } = useParams();

    const { loading, data } = useQuery<SprintQuery, SprintQueryVariables>(SprintDocument, {
        variables: {
            sprintId: sprintId!
        }
    })

    const [ addSprint, { loading: createSprintLoading } ] = useMutation<CreateSprintMutation, CreateSprintMutationVariables>(CreateSprintDocument)

    useEffect(() => {
        if (!loading && data) {
            const { sprint } = data
            if (!sprint) {
                addSprint({
                    variables: {
                        id: sprintId!
                    },
                    refetchQueries: [{
                        query: SprintDocument,
                        variables: { sprintId: sprintId! }
                    }]
                })
            }
        }
    }, [loading, data, sprintId, addSprint])

    const sprintLoading = loading || createSprintLoading 

    console.log(data)

    return <>
        {sprintLoading && 'Loading!'}
        { data && data.sprint && data.actions && <Board sprintId={data.sprint.id} actions={data.actions?.nodes!} /> }
    </>
}

export default Sprint