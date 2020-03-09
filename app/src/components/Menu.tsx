import React, { useCallback, useState } from 'react'
import MoreIcon from '@material-ui/icons/MoreVert';
import { IconButton, Menu as MuiMenu, MenuItem } from '@material-ui/core';
import { useSnackbar } from 'notistack'
import { useSyncDispatch, useSprintId } from '../hooks/sprintHooks';
import { setSprintTitle, toggleLock } from '../slices/SprintSlice';
import SlideshowIcon from '@material-ui/icons/Slideshow';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../slices';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import copy from 'copy-to-clipboard';

const Menu: React.FC = () => {
    const dispatch = useSyncDispatch()
    const history = useHistory()
    const [anchorEl, setAnchorEl] = useState<Element | null>(null);
    const handleMenu = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget)
    }, [])
    const sprintLocked = useSelector((state: RootState) => state.sprint.locked)
    const onToggleLock = useCallback(() => {
        dispatch(toggleLock())
        setAnchorEl(null)
    }, [dispatch])
    const handleClose = useCallback(() => {
        setAnchorEl(null)
    }, [])
    const sprintId = useSprintId()
    const { enqueueSnackbar } = useSnackbar()
    const onCopy = useCallback(() => {
        copy(`${window.location.protocol}//${window.location.host}/sprints/${sprintId}`)
        enqueueSnackbar('URL copied', { variant: 'info' })
        setAnchorEl(null)
    }, [sprintId, enqueueSnackbar])
    const onSetSprintName = useCallback(() => {
        const title = prompt()
        if (title) {
            dispatch(setSprintTitle(title))
        }
        setAnchorEl(null)
    }, [dispatch])
    const onDisplay = useCallback(() => {
        history.push(`/sprints/${sprintId}/display`)
    }, [history, sprintId])
    const open = !!anchorEl

    return <div>
        <IconButton aria-label="menu" edge="end" color="inherit" onClick={handleMenu}>
            <MoreIcon />
        </IconButton>
        <MuiMenu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={onCopy}>Copy Sprint URL&nbsp;<ShareIcon color="action" /></MenuItem>
            <MenuItem onClick={onSetSprintName}>Set Sprint Name&nbsp;<EditIcon color="action" /></MenuItem>
            <MenuItem onClick={onToggleLock}>{sprintLocked ? <>Unlock&nbsp;<LockOpenIcon color="action" /></> : <>Lock&nbsp;<LockIcon color="action" /></>}</MenuItem>
            <MenuItem onClick={onDisplay}>Present&nbsp;<SlideshowIcon color="action" /></MenuItem>
        </MuiMenu>
    </div>
}

export default Menu;