import React, { useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSprint, useSyncDispatch } from '../hooks/sprintHooks';
import { Box, makeStyles, Button, Typography, Card as MuiCard, CardActions, IconButton, CardContent, Toolbar, AppBar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from '../slices';
import { addColumn, addCard, deleteColumn, deleteCard, Column, Card, editColumn, editCard, moveCard, reorderColumn } from '../slices/SprintSlice';
import { v4 as uuid } from 'uuid'
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import clsx from 'clsx'
import EditIcon from '@material-ui/icons/Edit';
import { useDrag, DragSourceMonitor, useDrop, XYCoord } from 'react-dnd'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import MoreIcon from '@material-ui/icons/MoreVert';
import clientId from '../clientId';
import ItemTypes from '../drag/ItemTypes';

const useStyle = makeStyles(theme => ({
    root: {},
    toolbarTitle: {
        flexGrow: 1
    },
    sprintTitle: {
        flexGrow: 1
    },
    column: {
        flex: 1,
        margin: theme.spacing(1),
        padding: theme.spacing(2, 2),
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        '&$isDragging': {
            opacity: 0
        }
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

const ColumnComponent: React.FC<{ column: Column, index: number }> = ({ column, index }) => {
    const dispatch = useSyncDispatch()
    const classes = useStyle()
    const ref = useRef<HTMLDivElement>(null)

    const onEditColumn = useCallback((column: Column) => {
        const text = prompt(undefined, column.title)
        if (text) {
            dispatch(editColumn({ columnId: column.id, title: text }))
        }
    }, [dispatch])

    const onDeleteColumn = useCallback((column: Column) => {
        dispatch(deleteColumn(column.id))
    }, [dispatch])

    const onAddCard = useCallback((columnId: string) => {
        const text = prompt()
        if (text) {
            dispatch(addCard({
                column: columnId,
                id: uuid(),
                text: text,
                userId: clientId
            }))
        }
    }, [dispatch])

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.COLUMN, id: column.id, index: index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    const [_, columnDrop] = useDrop({
        accept: ItemTypes.COLUMN,
        hover(item: { id: string, index: number, type: string }, monitor) {
            if (!ref.current || item.type !== ItemTypes.COLUMN) return
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) return

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect()
            // Get middle
            const hoverMiddle = (hoverBoundingRect.right - hoverBoundingRect.left) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the start
            const hoverClient = (clientOffset as XYCoord).x - hoverBoundingRect.left

            // Dragging back
            if (dragIndex < hoverIndex && hoverClient < hoverMiddle) return

            // Dragging forward
            if (dragIndex > hoverIndex && hoverClient > hoverMiddle) return

            item.index = hoverIndex
            dispatch(reorderColumn({fromIndex: dragIndex, index: hoverIndex}))
        }
    })

    const [{ canDrop, isOver }, cardDrop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (_, monitor) => {
            if (!monitor.didDrop()) {
                return { type: ItemTypes.COLUMN, column }
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    drag(columnDrop(cardDrop(ref)))

    return <div key={column.id} ref={ref} className={clsx({
        [classes.canDrop]: canDrop,
        [classes.isOver]: isOver,
        [classes.isDragging]: isDragging
    }, classes.column)}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>{column.title}</Typography>
            <Box>
                <IconButton size="small" onClick={() => onEditColumn(column)} aria-label="delete"><EditIcon /></IconButton>
                <IconButton size="small" onClick={() => onDeleteColumn(column)} aria-label="delete"><DeleteIcon /></IconButton>
            </Box>
        </Box>
        <Box marginTop={2} marginBottom={2}>
            <Button variant="contained" color="primary" fullWidth startIcon={<AddIcon />} onClick={() => onAddCard(column.id)}>Add card</Button>
        </Box>
        <Box marginTop={2} marginBottom={2}>
            {
                column.cards.map(card => <Box key={card.id} marginTop={1}>
                    <CardComponent card={card} />
                </Box>)
            }
        </Box>
    </div>
}

const CardComponent: React.FC<{ card: Card }> = ({ card }) => {
    const dispatch = useSyncDispatch()
    const onEditCard = useCallback((card: Card) => {
        const text = prompt(undefined, card.text)
        if (text) {
            dispatch(editCard({ cardId: card.id, text: text }))
        }
    }, [dispatch])
    const ref = useRef<HTMLDivElement>(null)
    const classes = useStyle()

    const onDeleteCard = useCallback((card: Card) => {
        dispatch(deleteCard(card.id))
    }, [dispatch])

    const [{ isDragging }, columnDrag] = useDrag({
        item: { card: card.id, type: ItemTypes.CARD },
        end: (item: { card: string } | undefined, monitor: DragSourceMonitor) => {
            const result: ( { type: 'column', column: Column } | { type: 'card', card: Card } ) | undefined = monitor.getDropResult()
            console.log(result)
            if (item && result?.type === 'column') {
                dispatch(moveCard({ cardId: card.id, columnId: result.column.id }))
            }
            if (item && result?.type === 'card') {
                console.log('card dropped')
                //dispatch(moveCard({ cardId: card.id, columnId: result.column.id }))
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const [_, cardDrop] = useDrop({
        accept: ItemTypes.CARD,
        drop: () => ({ type: ItemTypes.CARD, card })
    })

    cardDrop(columnDrag(ref))

    return <MuiCard ref={ref} className={clsx({
        [classes.isDragging]: isDragging
    })}>
        <CardContent>
            <Typography>{card.text}</Typography>
        </CardContent>
        <CardActions>
            {card.userId === clientId && <IconButton size="small" onClick={() => onEditCard(card)} aria-label="edit"><EditIcon /></IconButton>}
            {card.userId === clientId && <IconButton size="small" onClick={() => onDeleteCard(card)} aria-label="delete"><DeleteIcon /></IconButton>}
            {card.userId !== clientId && <IconButton size="small" onClick={() => {}} aria-label="like"><ThumbUpIcon /></IconButton>}
            {card.userId !== clientId && <IconButton size="small" onClick={() => onDeleteCard(card)} aria-label="comment"><CommentIcon /></IconButton>}
        </CardActions>
    </MuiCard>
}

const Sprint: React.FC = () => {
    const { sprintId } = useParams();
    const classes = useStyle()

    const [loading, sprint] = useSprint(sprintId!)
    const dispatch = useSyncDispatch()

    const columns = useSelector((state: RootState) => state.sprint.columns)
    const onAddColumn = useCallback(() => {
        const columnName = prompt()
        if (columnName) {
            dispatch(addColumn({
                id: uuid(),
                title: columnName
            }))
        }
    }, [dispatch])

    if (loading) {
        return <>Loading</>
    }

    return <div>
        <AppBar position="static">
            <Toolbar>
                <Typography className={classes.toolbarTitle} variant="h6">
                    retr
                </Typography>
                <IconButton aria-label="display more actions" edge="end" color="inherit">
                    <MoreIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
        <Box className={classes.root} width="100vw" height="100vh" display="flex" flexDirection="column">
            <Box margin={1} display="flex" alignItems="center">
                <Typography variant="h4" className={classes.sprintTitle}>{sprint?.title}</Typography>
                <Button startIcon={<AddIcon />} variant="contained" color="primary" onClick={onAddColumn}>Add column</Button>
            </Box>
            <Box display="flex">
                {columns.map((column, idx) => <ColumnComponent key={column.id} column={column} index={idx} />)}
                <Box>
                </Box>
            </Box>
        </Box>
    </div>
}

export default Sprint