import React, { useCallback } from 'react'
import { useSprint, useSyncDispatch, useColumnNavigation } from '../hooks/sprintHooks';
import { Box, Button, CircularProgress, Typography, Toolbar, AppBar, useMediaQuery, useTheme } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Menu from './Menu';
import { RootState } from '../slices';
import { addColumn } from '../slices/SprintSlice';
import { v4 as uuid } from 'uuid'
import AddIcon from '@material-ui/icons/Add';
import useStyle from './styles';
import ColumnComponent from './Column';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Switch, Route } from 'react-router-dom';

const Sprint: React.FC = () => {
    const classes = useStyle()

    const [loading] = useSprint()
    const dispatch = useSyncDispatch()
    const sprintLocked = useSelector((state: RootState) => state.sprint.locked)

    const columns = useSelector((state: RootState) => state.sprint.columns)
    const title = useSelector((state: RootState) => state.sprint.title)
    const onAddColumn = useCallback(() => {
        const columnName = prompt()
        if (columnName) {
            dispatch(addColumn({
                id: uuid(),
                title: columnName
            }))
        }
    }, [dispatch])

    const theme = useTheme()
    const mobile = useMediaQuery(theme.breakpoints.down('sm'))
    const {
        onPrevColumn,
        onNextColumn,
        hasPrevColumn,
        hasNextColumn,
        visibleColumn,
        visibleColumnIdx
    } = useColumnNavigation(columns)

    if (loading) {
        return <Box height="100vh" width="100vw" display="flex" alignItems="center" justifyContent="center">
            <CircularProgress size={100} />
        </Box>
    }

    return <Switch>
        <Route path="/sprints/:sprintId/display">
            <div>hihi</div>
        </Route>
        <Route>
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography className={classes.toolbarTitle} variant="h6">
                            {title}
                        </Typography>
                        <Menu />
                    </Toolbar>
                </AppBar>
                <Box className={classes.sprint}>
                    <Box margin={1} display="flex" alignItems="center" justifyContent={mobile ? "space-between" : "flex-end"}>
                        {mobile && <Button onClick={onPrevColumn} disabled={!hasPrevColumn} startIcon={<ArrowBackIcon />}>Previous</Button>}
                        <Button disabled={sprintLocked} startIcon={<AddIcon />} variant="contained" color="primary" onClick={onAddColumn}>Add column</Button>
                        {mobile && <Button onClick={onNextColumn} disabled={!hasNextColumn} endIcon={<ArrowForwardIcon />}>Next</Button>}
                    </Box>
                    <Box className={classes.columns} flexGrow={1}>
                        {!mobile && columns.map((column, idx) => <ColumnComponent key={column.id} column={column} index={idx} />)}
                        {mobile && visibleColumn && <ColumnComponent column={visibleColumn} index={visibleColumnIdx} />}
                    </Box>
                </Box>
            </div>
        </Route>
    </Switch>
}

export default Sprint