import React from 'react'
import { Action } from '../generated';

type Props = {
    sprintId: string
    actions: Pick<Action, 'id' | 'type' | 'timestamp' | 'payload'>[]
}

const Board: React.FC<Props> = () => {
    return <>
        loaded!
    </>
}

export default Board;