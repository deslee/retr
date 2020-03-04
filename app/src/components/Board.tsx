import React from 'react'
import { Action } from '../generated';
import { Grid, Button } from '@material-ui/core'

type Props = {
    sprintId: string
    actions: Pick<Action, 'id' | 'type' | 'timestamp' | 'payload'>[]
}


const Board: React.FC<Props> = () => {
    return <>
        <Grid container>
            <Button> click here to add a stupid card </Button>
            <Grid item xs={4}>
                HAHAHAHAHA
            </Grid>
            <Grid item xs={4}>
                HAHAHAHAHA
            </Grid>
            <Grid item xs={4}>
                HAHAHAHAHA
            </Grid>
        </Grid>
    </>
}

export default Board;