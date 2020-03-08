import React, { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useSprint, useSyncDispatch } from '../hooks/sprintHooks';
import { Box, makeStyles, Button, Typography, Card, CardActions, IconButton, CardContent } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../slices';
import { addColumn, addCard, deleteColumn, deleteCard, Column, Card as CardState, editColumn, editCard, moveCard } from '../slices/SprintSlice';
import { v4 as uuid } from 'uuid'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx'
import EditIcon from '@material-ui/icons/Edit';
import { useDrag, DragSourceMonitor, useDrop } from 'react-dnd'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import clientId from '../clientId';
import ItemTypes from '../drag/ItemTypes';

const useStyle = makeStyles(theme => ({
    root: {},
    column: {
        flex: 1,
        margin: theme.spacing(1),
        padding: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`
    },
    canDrop: {
        background: theme.palette.action.hover
    },
    isOver: {
        background: theme.palette.action.selected
    },
    isDragging: {
        opacity: 0.4
    }
}))

const ColumnComponent: React.FC<{ column: Column }> = ({ column }) => {
    const dispatch = useSyncDispatch()
    const classes = useStyle()

    const onEditColumn = useCallback((column: Column) => {
        const text = prompt(undefined, column.title)
        dispatch(editColumn({ columnId: column.id, title: text || '' }))
    }, [dispatch])

    const onDeleteColumn = useCallback((column: Column) => {
        dispatch(deleteColumn(column.id))
    }, [dispatch])

    const onAddCard = useCallback((columnId: string) => {
        const text = prompt()
        dispatch(addCard({
            column: columnId,
            id: uuid(),
            text: text || '',
            userId: clientId
        }))
    }, [dispatch])

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: () => column,
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    return <div key={column.id} ref={drop} className={clsx({
        [classes.canDrop]: canDrop,
        [classes.isOver]: isOver,
    }, classes.column)}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>{column.title}</Typography>
            <Box>
                <IconButton color="secondary" onClick={() => onEditColumn(column)} aria-label="delete"><EditIcon /></IconButton>
                <IconButton color="secondary" onClick={() => onDeleteColumn(column)} aria-label="delete"><DeleteIcon /></IconButton>
            </Box>
        </Box>
        <Box marginBottom={2}>
            <Button variant="contained" color="primary" fullWidth startIcon={<AddIcon />} onClick={() => onAddCard(column.id)}>Add card</Button>
        </Box>
        {
            column.cards.map(card => <Box key={card.id} marginTop={1}>
                <CardComponent card={card} />
            </Box>)
        }
    </div>
}

const CardComponent: React.FC<{ card: CardState }> = ({ card }) => {
    const dispatch = useSyncDispatch()
    const onEditCard = useCallback((card: CardState) => {
        const text = prompt(undefined, card.text)
        dispatch(editCard({ cardId: card.id, text: text || '' }))
    }, [dispatch])
    const classes = useStyle()

    const onDeleteCard = useCallback((card: CardState) => {
        dispatch(deleteCard(card.id))
    }, [dispatch])

    const [{ isDragging }, drag] = useDrag({
        item: { card: card.id, type: ItemTypes.CARD },
        end: (item: { card: string } | undefined, monitor: DragSourceMonitor) => {
            const column: Column | undefined = monitor.getDropResult()
            if (item && column) {
                dispatch(moveCard({ cardId: card.id, columnId: column.id }))
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })

    return <Card ref={drag} className={clsx({
        [classes.isDragging]: isDragging
    })}>
        <CardContent>
            <Typography>{card.text}</Typography>
        </CardContent>
        <CardActions>
            {card.userId === clientId && <IconButton color="secondary" onClick={() => onEditCard(card)} aria-label="edit"><EditIcon /></IconButton>}
            {card.userId === clientId && <IconButton color="secondary" onClick={() => onDeleteCard(card)} aria-label="delete"><DeleteIcon /></IconButton>}
        </CardActions>
    </Card>
}

const Sprint: React.FC = () => {
    const { sprintId } = useParams();
    const classes = useStyle()

    const loading = useSprint(sprintId!)
    const dispatch = useSyncDispatch()

    const columns = useSelector((state: RootState) => state.sprint.columns)
    const onAddColumn = useCallback(() => {
        const columnName = prompt()
        dispatch(addColumn({
            id: uuid(),
            title: columnName || ''
        }))
    }, [dispatch])

    if (loading) {
        return <>Loading</>
    }

    return <div>
        <Box className={classes.root} width="100vw" height="100vh" display="flex" flexDirection="column">
            <Box margin={1}>
                <Button startIcon={<AddIcon />} variant="contained" fullWidth color="primary" onClick={onAddColumn}>Add column</Button>
            </Box>
            <Box display="flex">
                {columns.map(column => <ColumnComponent key={column.id} column={column} />)}
                <Box>
                </Box>
            </Box>
        </Box>
    </div>
}

export default Sprint