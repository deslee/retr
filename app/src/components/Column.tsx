import { Column, editColumn, deleteColumn, addCard, reorderColumn } from "../slices/SprintSlice"
import { v4 as uuid } from 'uuid'
import { useSyncDispatch } from "../hooks/sprintHooks"
import DragHandleIcon from '@material-ui/icons/DragHandle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import useStyle from "./styles"
import { useRef, useCallback } from "react"
import clientId from "../clientId"
import { useDrag, useDrop, XYCoord } from "react-dnd"
import ItemTypes from "../drag/ItemTypes"
import clsx from "clsx"
import { Box, Button, Typography, IconButton } from '@material-ui/core';
import React from "react"
import CardComponent from "./Card"
import { useSelector } from "react-redux";
import { RootState } from "../slices";

const ColumnComponent: React.FC<{ column: Column, index: number }> = ({ column, index }) => {
    const dispatch = useSyncDispatch()
    const classes = useStyle()
    const columnRef = useRef<HTMLDivElement>(null)
    const dragRef = useRef<HTMLDivElement>(null)
    const sprintLocked = useSelector((state: RootState) => state.sprint.locked)

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
        }),
        canDrag: monitor => {
            if (!dragRef.current) return false;
            if (sprintLocked) return false
            const {x, y, width, height} = dragRef.current.getBoundingClientRect()
            const {x: mouseX, y: mouseY} = monitor.getClientOffset()!
            return (
                y < mouseY && mouseY < (y+height) &&
                x < mouseX && mouseX < (x+width)
            )
        }
    })

    const [, columnDrop] = useDrop({
        accept: ItemTypes.COLUMN,
        hover(item: { id: string, index: number, type: string }, monitor) {
            if (!columnRef.current || item.type !== ItemTypes.COLUMN) return
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) return

            // Determine rectangle on screen
            const hoverBoundingRect = columnRef.current.getBoundingClientRect()
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
        collect: monitor => {
            return {
                isOver: monitor.isOver({shallow: true}) && monitor.getItem().column !== column.id,
                canDrop: monitor.canDrop() && monitor.getItem().column !== column.id,
            }
        },
    })

    drag(columnDrop(cardDrop(columnRef)))

    return <div key={column.id} ref={columnRef} className={clsx({
        [classes.canDrop]: canDrop,
        [classes.isOver]: isOver,
        [classes.isDragging]: isDragging
    }, classes.column)}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex">
                <div ref={dragRef} style={{cursor: sprintLocked ? 'not-allowed' : 'grab'}}><DragHandleIcon color="action" /></div>
                <Typography display="inline">{column.title}</Typography>
            </Box>
            <Box>
                <IconButton size="small" onClick={() => onEditColumn(column)} aria-label="delete"><EditIcon /></IconButton>
                <IconButton size="small" onClick={() => onDeleteColumn(column)} aria-label="delete"><DeleteIcon /></IconButton>
            </Box>
        </Box>
        <Box marginTop={2} marginBottom={2}>
            <Button disabled={sprintLocked} variant="contained" color="primary" fullWidth startIcon={<AddIcon />} onClick={() => onAddCard(column.id)}>Add card</Button>
        </Box>
        <Box marginTop={2} marginBottom={2}>
            {
                column.cards.map(card => <Box key={card.id} marginTop={1}>
                    <CardComponent card={card} column={column} />
                </Box>)
            }
        </Box>
    </div>
}

export default ColumnComponent