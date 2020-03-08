import React from 'react'
import { Grid, Button } from '@material-ui/core'
import { useSelector } from 'react-redux';
import { RootState } from '../slices';
import { useAddCard } from '../hooks/sprintHooks';

type Props = {
    sprintId: string
}


const Board: React.FC<Props> = (props) => {
    const cards = useSelector((state: RootState) => state.sprint.cards)
    const addCard = useAddCard()
    return <>
        <Grid container>
            <Grid item xs={12}>{cards.join(',')}</Grid>
            <Grid item xs={12}><Button onClick={() => addCard(new Date().toString())}>Click here to add a card</Button></Grid>
        </Grid>
    </>
}

export default Board;