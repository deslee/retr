import { Card, Column, editCard, deleteCard, moveCard, voteCard, commentCard, nestCard } from "../slices/SprintSlice"
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import CommentIcon from '@material-ui/icons/Comment';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSyncDispatch } from "../hooks/sprintHooks"
import { Typography, Card as MuiCard, CardActions, IconButton, CardContent, Box } from '@material-ui/core';
import { useCallback, useRef } from "react"
import useStyle from "./styles"
import { useDrag, DragSourceMonitor, useDrop } from "react-dnd"
import ItemTypes from "../drag/ItemTypes"
import clsx from "clsx"
import clientId from "../clientId"
import React from "react"
import { useSelector } from "react-redux";
import { RootState } from "../slices";
import MergeTypeIcon from '@material-ui/icons/MergeType';

const CardComponent: React.FC<{ card: Card, column: Column }> = ({ card, column }) => {
    const dispatch = useSyncDispatch()

    const onEdit = useCallback(() => {
        const text = prompt(undefined, card.text)
        if (text) {
            dispatch(editCard({ cardId: card.id, text: text }))
        }
    }, [dispatch, card.id, card.text])
    const ref = useRef<HTMLDivElement>(null)
    const sprintLocked = useSelector((state: RootState) => state.sprint.locked)
    const classes = useStyle()

    const onDelete = useCallback(() => {
        dispatch(deleteCard(card.id))
    }, [dispatch, card.id])

    const onVote = useCallback(() => {
        dispatch(voteCard({ cardId: card.id, userId: clientId }))
    }, [dispatch, card.id])

    const onComment = useCallback(() => {
        const text = prompt(undefined)
        if (text) {
            dispatch(commentCard({ cardId: card.id, text: text, userId: clientId }))
        }
    }, [dispatch, card.id])

    const [{ isDragging }, drag] = useDrag({
        item: { card: card.id, type: ItemTypes.CARD, column: column.id },
        end: (item: { card: string } | undefined, monitor: DragSourceMonitor) => {
            const result: ( { type: 'column', column: Column } | { type: 'card', card: Card } ) | undefined = monitor.getDropResult()
            if (item && result?.type === 'column') {
                if (result.column.id !== column.id)
                dispatch(moveCard({ cardId: card.id, columnId: result.column.id }))
            }
            if (item && result?.type === 'card' && result.card.id !== item.card) {
                dispatch(nestCard({ parentCardId: result.card.id, childCardId: item.card }))
            }
        },
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => {
            return !sprintLocked
        }
    })

    const [{isOver, canDrop}, cardDrop] = useDrop({
        accept: ItemTypes.CARD,
        drop: () => ({ type: ItemTypes.CARD, card }),
        collect: monitor => {
            return {
                canDrop: monitor.canDrop(),
                isOver: monitor.isOver() && monitor.getItem().card !== card.id
            }
        }
    })

    cardDrop(drag(ref))

    function getChildren(card: Card): number {
        return card.children.length + card.children.map(getChildren).reduce((count, val) => count+val, 0)
    }
    const numChildren = getChildren(card)

    return <MuiCard elevation={3} ref={ref} className={clsx({
        [classes.isDragging]: isDragging,
        [classes.isOver]: isOver,
        [classes.canDrop]: canDrop
    }, classes.card)}>
        <CardContent>
            <Typography>{card.text}</Typography>
        </CardContent>
        <CardActions>
            <Box display="flex" justifyContent="space-between" width="100%"> 
                <Box>
                    {card.userId === clientId && <>
                        <IconButton size="small" onClick={onEdit} aria-label="edit"><EditIcon /></IconButton>
                        <IconButton size="small" onClick={onDelete} aria-label="delete"><DeleteIcon /></IconButton>
                    </>}
                </Box>
                <Box>
                    {numChildren > 0 && <><IconButton color="primary" size="small"><MergeTypeIcon /></IconButton>{numChildren}</>}
                    &nbsp;&nbsp;
                    <IconButton color={card.votes.indexOf(clientId) === -1 ? 'default' : 'primary'} size="small" onClick={onVote} aria-label="like"><ThumbUpIcon /></IconButton>
                    {card.votes.length}
                    &nbsp;&nbsp;
                    <IconButton size="small" onClick={onComment} aria-label="comment"><CommentIcon /></IconButton>
                    {card.comments.length}
                </Box>
            </Box>
        </CardActions>
    </MuiCard>
}

export default CardComponent