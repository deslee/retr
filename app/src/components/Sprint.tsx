import React from 'react'
import { useParams } from 'react-router-dom'
import Board from './Board';
import { useSprint } from '../hooks/sprintHooks';

const Sprint: React.FC = () => {
    const { sprintId } = useParams();

    const loading = useSprint(sprintId!)

    return <>
        {loading && 'Loading!'}
        {!loading && <Board sprintId={sprintId!} />}
    </>
}

export default Sprint